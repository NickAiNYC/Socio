import { randomUUID } from 'crypto';
import { ExperimentError, ValidationError } from './errors.mjs';
import { compareGroups, MIN_SAMPLE_PER_GROUP } from './economic/stats.mjs';

/**
 * Experiment Engine
 * Manages the lifecycle of growth hypotheses and tests.
 */
export class ExperimentEngine {
  constructor(repository) {
    /** @type {import('./repositories/memory-repository.mjs').MemoryRepository} */
    this.repository = repository;
  }

  /**
   * Creates a new experiment in DRAFT state.
   */
  async createExperiment(config) {
    this._validateConfig(config);

    const experiment = {
      ...config,
      id: config.id || randomUUID(),
      status: 'DRAFT',
      observations: [],
      createdAt: new Date().toISOString()
    };

    return await this.repository.save(experiment.id, experiment);
  }

  /**
   * Starts an experiment, transitioning it to RUNNING.
   */
  async startExperiment(id) {
    const exp = await this.getExperiment(id);
    if (exp.status !== 'DRAFT' && exp.status !== 'PAUSED') {
      throw new ExperimentError(`Cannot start experiment from status: ${exp.status}`);
    }

    return await this.repository.update(id, { 
      status: 'RUNNING', 
      startAt: new Date().toISOString() 
    });
  }

  /**
   * Pauses an active experiment.
   */
  async pauseExperiment(id) {
    const exp = await this.getExperiment(id);
    if (exp.status !== 'RUNNING') {
      throw new ExperimentError(`Cannot pause experiment from status: ${exp.status}`);
    }

    return await this.repository.update(id, { status: 'PAUSED' });
  }

  /**
   * Adds an observation to an experiment.
   */
  async observe(id, observationData) {
    const exp = await this.getExperiment(id);
    if (exp.status !== 'RUNNING') {
      throw new ExperimentError(`Cannot observe on experiment in status: ${exp.status}`);
    }

    const observation = {
      ...observationData,
      id: randomUUID(),
      timestamp: new Date().toISOString()
    };

    const updatedObservations = [...(exp.observations || []), observation];
    return await this.repository.update(id, { observations: updatedObservations });
  }

  /**
   * Evaluates current observations against the baseline.
   *
   * When observations carry a `variant` (treatment/control), evaluation uses
   * group comparison: insufficient samples return INCONCLUSIVE, and a verdict
   * is only produced at adequate sample size. Without variants, the legacy
   * baseline-ratio mode is used (kept for backward compatibility).
   */
  async evaluate(id) {
    const exp = await this.getExperiment(id);

    if (!exp.observations || exp.observations.length === 0) {
      return { confidence: 0, result: 'INCONCLUSIVE', reason: 'No observations' };
    }

    const hasVariants = exp.observations.some((o) => o.variant);

    if (hasVariants) {
      const treatment = exp.observations.filter((o) => o.variant === 'treatment').map((o) => o.value);
      const control = exp.observations.filter((o) => o.variant === 'control').map((o) => o.value);
      if (treatment.length === 0 || control.length === 0) {
        return { confidence: 0, result: 'INCONCLUSIVE', reason: 'Both control and treatment groups are required' };
      }
      const cmp = compareGroups(treatment, control);
      if (!cmp.sufficient) {
        return {
          confidence: 0,
          result: 'INCONCLUSIVE',
          reason: `Insufficient sample (treatment n=${cmp.nTreatment}, control n=${cmp.nControl})`,
          sampleSize: exp.observations.length,
          stats: cmp,
        };
      }
      if (cmp.verdict === 'significant_positive') {
        return {
          confidence: 1 - cmp.pApprox,
          result: 'PROMOTABLE',
          reason: `Significant positive lift (approx p=${cmp.pApprox.toFixed(4)})`,
          sampleSize: exp.observations.length,
          stats: cmp,
        };
      }
      if (cmp.verdict === 'significant_negative') {
        return {
          confidence: 1 - cmp.pApprox,
          result: 'KILLABLE',
          reason: `Significant negative effect (approx p=${cmp.pApprox.toFixed(4)})`,
          sampleSize: exp.observations.length,
          stats: cmp,
        };
      }
      return {
        confidence: null,
        result: 'INCONCLUSIVE',
        reason: 'No detectable effect between groups',
        sampleSize: exp.observations.length,
        stats: cmp,
      };
    }

    // Legacy baseline mode (backward compatible).
    const positiveOutcomes = exp.observations.filter(o => o.value > exp.baseline).length;
    const confidence = positiveOutcomes / exp.observations.length;

    let result = 'INCONCLUSIVE';
    if (exp.observations.length >= MIN_SAMPLE_PER_GROUP) {
      if (confidence > 0.95) result = 'PROMOTABLE';
      if (confidence < 0.05) result = 'KILLABLE';
    }

    return { confidence, result, sampleSize: exp.observations.length };
  }

  /**
   * Promotes an experiment (winner).
   */
  async promote(id, rationale) {
    await this.getExperiment(id);
    // The system should never automatically promote an experiment simply because of one positive observation.
    // Ensure sufficient data exists via evaluation
    const evaluation = await this.evaluate(id);
    
    // We allow explicit promotion with strong rationale even if statistical confidence isn't met, 
    // representing a human override, but we log the evaluation state.
    if (!rationale) throw new ValidationError('Rationale is required to promote an experiment');

    return await this.repository.update(id, { 
      status: 'PROMOTED', 
      endAt: new Date().toISOString(),
      decision: 'PROMOTED',
      rationale: `${rationale} (Confidence at promotion: ${evaluation.confidence})`
    });
  }

  /**
   * Kills an experiment (loser/aborted).
   */
  async kill(id, rationale) {
    await this.getExperiment(id);
    
    return await this.repository.update(id, { 
      status: 'KILLED', 
      endAt: new Date().toISOString(),
      decision: 'KILLED',
      rationale
    });
  }

  async getExperiment(id) {
    const exp = await this.repository.get(id);
    if (!exp) throw new ExperimentError(`Experiment ${id} not found`);
    return exp;
  }

  /**
   * Lists experiments for a business.
   */
  async listExperiments(businessId) {
    return await this.repository.findAll((e) => e.businessId === businessId);
  }

  _validateConfig(config) {
    if (!config.businessId) throw new ValidationError('businessId is required');
    if (!config.hypothesis) throw new ValidationError('hypothesis is required');
    if (!config.objective) throw new ValidationError('objective is required');
    if (!config.metric) throw new ValidationError('metric is required');
    if (config.baseline === undefined) throw new ValidationError('baseline is required');
    if (!config.variants || !Array.isArray(config.variants)) throw new ValidationError('variants array is required');
  }
}

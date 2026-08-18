export class GrowthOSError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GrowthOSError';
  }
}

export class ValidationError extends GrowthOSError {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class PolicyViolationError extends GrowthOSError {
  constructor(message, risk, policy) {
    super(message);
    this.name = 'PolicyViolationError';
    this.risk = risk;
    this.policy = policy;
  }
}

export class BusinessTwinConflictError extends GrowthOSError {
  constructor(message) {
    super(message);
    this.name = 'BusinessTwinConflictError';
  }
}

export class ExperimentError extends GrowthOSError {
  constructor(message) {
    super(message);
    this.name = 'ExperimentError';
  }
}

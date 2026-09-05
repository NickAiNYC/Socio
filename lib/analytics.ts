'use client';

export type AnalyticsEvent =
  // Owner Funnel
  | 'homepage_view'
  | 'start_project_clicked'
  | 'intake_started'
  | 'intake_completed'
  | 'project_created'
  | 'contractor_match_viewed'
  | 'contractor_contacted'
  | 'bid_received'
  | 'project_awarded'
  // Contractor Funnel
  | 'contractor_cta_clicked'
  | 'application_started'
  | 'profile_completed'
  | 'verification_started'
  | 'verification_completed'
  | 'opportunity_viewed'
  | 'bid_submitted';

export function trackEvent(eventName: AnalyticsEvent, properties?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;

  const payload = {
    event: eventName,
    timestamp: new Date().toISOString(),
    url: window.location.pathname,
    ...properties,
  };

  // Structured development telemetry
  if (process.env.NODE_ENV !== 'production') {
    console.info(`[SOCIO TELEMETRY]`, payload);
  }

  // Dispatch custom browser event for integrations (PostHog, Google Analytics, Datadog)
  try {
    const customEvent = new CustomEvent('socio:telemetry', { detail: payload });
    window.dispatchEvent(customEvent);
  } catch {
    // Graceful fallback
  }

  // Store recent session telemetry in sessionStorage for funnel debugging
  try {
    const existing = JSON.parse(sessionStorage.getItem('socio_events') || '[]');
    existing.push(payload);
    sessionStorage.setItem('socio_events', JSON.stringify(existing.slice(-50)));
  } catch {
    // Ignore storage quota errors
  }
}

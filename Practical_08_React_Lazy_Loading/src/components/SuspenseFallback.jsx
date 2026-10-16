import React from 'react';

/**
 * Meaningful Suspense Fallback Component
 * Fulfills Core Lab Requirement:
 * - Provides accessible status text (role="status", aria-live="polite")
 * - Visually communicates code-split dynamic chunk download in flight
 */
export default function SuspenseFallback({ routeName = "component" }) {
  return (
    <div className="suspense-fallback" role="status" aria-live="polite">
      <div className="suspense-spinner" aria-hidden="true"></div>
      <div>
        <h3 className="fallback-title">Loading Dynamic Route...</h3>
        <p className="fallback-sub">
          Retrieving on-demand JavaScript chunk for <strong>{routeName}</strong> via <code>React.lazy()</code>.
        </p>
      </div>
    </div>
  );
}

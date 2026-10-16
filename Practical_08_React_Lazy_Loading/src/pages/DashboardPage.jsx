import React from 'react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  return (
    <div className="container">
      <div className="card">
        <p className="section-tag">Performance Engineering</p>
        <h1 className="section-title">React Lazy Loading & Route Code Splitting</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
          Welcome to Practical 8! This application demonstrates route-level code splitting using <code>React.lazy()</code> and <code>&lt;Suspense&gt;</code>. Instead of downloading all page components upfront in a monolithic initial JavaScript bundle, non-critical routes are split into separate chunk files and downloaded on-demand when the user navigates to them.
        </p>

        <div className="metrics-banner">
          <strong>🔬 Lab Verification Guide:</strong>
          <ol style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <li>Open Browser DevTools (<code>F12</code>) and click the <strong>Network</strong> tab.</li>
            <li>Check the <strong>"Disable cache"</strong> checkbox.</li>
            <li>Set Throttling to <strong>"Slow 3G"</strong> or <strong>"Fast 3G"</strong>.</li>
            <li>Click on <strong>Tasks (Lazy)</strong> or <strong>Analytics (Lazy)</strong> in the navbar.</li>
            <li>Observe the <code>&lt;SuspenseFallback /&gt;</code> spinner rendering while the separate chunk is requested over the network!</li>
          </ol>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/tasks" className="btn btn-primary">
            Explore Lazy Tasks Route &rarr;
          </Link>
          <Link to="/analytics" className="btn btn-outline">
            Explore Heavy Analytics Chunk &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

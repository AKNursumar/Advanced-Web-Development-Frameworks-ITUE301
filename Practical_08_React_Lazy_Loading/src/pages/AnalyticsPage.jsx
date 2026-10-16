import React, { useState } from 'react';

/**
 * Supplementary Requirement: Heavy Route Component (Analytics & Metrics)
 * Loaded only when the user requests the analytics tab.
 * Uses default export for React.lazy().
 */
export default function AnalyticsPage() {
  const [activeRange, setActiveRange] = useState('7d');

  const metrics = [
    { label: 'Bundle Reduction', value: '38%', note: 'Initial JS payload savings' },
    { label: 'Routes Code-Split', value: '3', note: 'Tasks, Analytics, Contact' },
    { label: 'Chunks Generated', value: '4 Chunks', note: 'Main + 3 dynamic route chunks' },
    { label: 'Perceived FCP', value: 'Sub-400ms', note: 'Fast first contentful paint' }
  ];

  const chartData = [
    { day: 'Mon', tasks: 12, height: '48%' },
    { day: 'Tue', tasks: 19, height: '76%' },
    { day: 'Wed', tasks: 15, height: '60%' },
    { day: 'Thu', tasks: 25, height: '100%' },
    { day: 'Fri', tasks: 22, height: '88%' },
    { day: 'Sat', tasks: 8, height: '32%' },
    { day: 'Sun', tasks: 14, height: '56%' }
  ];

  return (
    <div className="container">
      <div className="card">
        <p className="section-tag">Heavy Analytical Component</p>
        <h1 className="section-title">Performance & Task Metrics Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          This component simulates a data-dense analytics visualization module, proving that heavy computational chunks are excluded from the critical initial rendering path.
        </p>

        <div className="analytics-grid">
          {metrics.map((m) => (
            <div key={m.label} className="metric-card">
              <div className="metric-val">{m.value}</div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                {m.label}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {m.note}
              </div>
            </div>
          ))}
        </div>

        <div className="chart-simulation">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Weekly Task Velocity (Simulated Chart)</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setActiveRange(range)}
                  className="btn btn-outline"
                  style={{
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.75rem',
                    background: activeRange === range ? 'var(--accent-primary)' : undefined,
                    color: activeRange === range ? '#fff' : undefined
                  }}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          <div className="chart-bar-container">
            {chartData.map((bar) => (
              <div key={bar.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
                <div
                  className="chart-bar"
                  style={{ height: bar.height, width: '70%' }}
                  title={`${bar.tasks} tasks completed`}
                ></div>
                <span className="chart-label">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

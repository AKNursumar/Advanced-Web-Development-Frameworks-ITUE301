import React, { useState, useEffect, useCallback } from 'react';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';
import RepoCard from '../components/RepoCard';
import { githubConfig } from '../config/github';

export default function ProjectsPage() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [fetchTimestamp, setFetchTimestamp] = useState(null);

  const fetchRepositories = useCallback(() => {
    setLoading(true);
    setError(null);

    // If simulated error is enabled in config for testing error paths
    if (githubConfig.simulateError) {
      setTimeout(() => {
        setError('Simulated network error: Failed to reach GitHub API. Toggle simulateError in src/config/github.js to restore.');
        setLoading(false);
      }, 700);
      return;
    }

    const targetUrl = githubConfig.API_URL(githubConfig.GITHUB_USERNAME);

    fetch(targetUrl, {
      headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    })
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) {
            throw new Error('GitHub API rate limit exceeded (60 requests/hr for unauthenticated IP). Please try again later.');
          }
          if (res.status === 404) {
            throw new Error(`GitHub user "${githubConfig.GITHUB_USERNAME}" not found. Verify the configured username.`);
          }
          throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error(data.message || 'Malformed JSON response from GitHub API.');
        }
        setRepos(data);
        setFetchTimestamp(new Date().toLocaleTimeString());
      })
      .catch((err) => {
        setError(err.message || 'An unexpected network error occurred while fetching repositories.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);

  // Client-side search / filter by repository name
  const filteredRepos = repos.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="section" aria-labelledby="repos-heading">
      <div className="container">
        <div className="section-header">
          <p className="section-tag">Live REST API Integration</p>
          <h2 id="repos-heading" className="section-title">
            Public Repositories ({repos.length})
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Consuming the live GitHub REST API for <code>@{githubConfig.GITHUB_USERNAME}</code> asynchronously on mount via <code>useEffect</code>.
          </p>
        </div>

        {/* Search & Attribution Controls */}
        <div className="api-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search repositories by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Filter repositories by name"
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span className="user-badge">
              <span>👤 User:</span>
              <a
                href={`https://github.com/${githubConfig.GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'underline', color: 'var(--accent-cyan)' }}
              >
                @{githubConfig.GITHUB_USERNAME}
              </a>
            </span>

            {fetchTimestamp && (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Last synced: {fetchTimestamp}
              </span>
            )}

            <button
              onClick={fetchRepositories}
              className="btn btn-outline"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
              title="Re-fetch repositories from GitHub"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Rate limit note */}
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)' }}>
          ℹ️ {githubConfig.rateLimitNote}
        </p>

        {/* State Conditional Rendering */}
        {loading && <Spinner message="Fetching live repositories from api.github.com..." />}

        {error && !loading && (
          <ErrorMessage error={error} onRetry={fetchRepositories} />
        )}

        {!loading && !error && (
          <>
            {filteredRepos.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>
                  {repos.length === 0
                    ? `No public repositories found for @${githubConfig.GITHUB_USERNAME}.`
                    : `No repositories match search query "${searchQuery}".`}
                </p>
              </div>
            ) : (
              <div className="repos-grid">
                {filteredRepos.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

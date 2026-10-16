import React from 'react';

export default function RepoCard({ repo }) {
  return (
    <article className="card repo-card" aria-label={`Repository ${repo.name}`}>
      <div>
        <div className="repo-header">
          <h3 className="repo-name">{repo.name}</h3>
          <span className="star-badge" title="GitHub Stars">
            ★ {repo.stargazers_count}
          </span>
        </div>
        <p className="repo-desc">
          {repo.description || (
            <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
              No public description provided for this repository.
            </span>
          )}
        </p>
      </div>

      <div className="repo-footer">
        <span className="repo-lang">
          {repo.language || 'Codebase'}
        </span>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="repo-link"
          aria-label={`View ${repo.name} repository on GitHub`}
        >
          View Repo ↗
        </a>
      </div>
    </article>
  );
}

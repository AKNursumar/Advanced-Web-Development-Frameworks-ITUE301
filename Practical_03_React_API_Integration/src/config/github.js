/**
 * GitHub API Integration Configuration
 * Course: AWDF (ITUE301) | Practical 3
 * Student: Abdulkadir Nursumar (AK Nursumar)
 *
 * NOTE: 
 * - Unauthenticated requests to GitHub REST API are limited to 60 requests per hour per IP.
 * - To test the error path in Practical 3, change GITHUB_USERNAME to a non-existent user 
 *   (e.g., "__non_existent_github_user_404__") or set simulateError: true below.
 */
export const githubConfig = {
  // Default verified student username
  GITHUB_USERNAME: "AKNursumar",
  
  // API URL endpoint
  API_URL: (username) => `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`,
  
  // Flag to simulate network failure for testing error UI & retry button without breaking config
  simulateError: false,

  // Fallback / instructions notice
  rateLimitNote: "GitHub public REST API permits 60 unauthenticated requests/hour. Responses are fetched live."
};

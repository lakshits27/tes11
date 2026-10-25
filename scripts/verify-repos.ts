import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { PROJECTS } from '../src/content/projects.ts';

interface RepositoryResponse {
  full_name: string;
  html_url: string;
  default_branch: string;
  pushed_at: string;
  archived: boolean;
}

function githubJson<T>(endpoint: string): T {
  const output = execFileSync('gh', ['api', endpoint], {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  return JSON.parse(output) as T;
}

for (const project of PROJECTS) {
  const url = new URL(project.verified.repository);
  const [owner, repo] = url.pathname.split('/').filter(Boolean);
  assert.ok(owner && repo, `Invalid repository URL: ${project.verified.repository}`);
  const path = `${owner}/${repo}`;
  let data: RepositoryResponse;
  try {
    data = githubJson<RepositoryResponse>(`repos/${path}`);
  } catch (error) {
    throw new Error(`GitHub repository unavailable: ${project.verified.repository}`, { cause: error });
  }
  assert.equal(data.full_name.toLowerCase(), path.toLowerCase(), `Repository mismatch for ${project.name}`);
  assert.equal(data.html_url.toLowerCase(), project.verified.repository.toLowerCase(), `Canonical URL mismatch for ${project.name}`);
  assert.equal(data.archived, false, `Repository archived: ${project.name}`);
  assert.ok(data.default_branch, `Missing default branch for ${project.name}`);

  const releaseTag = project.releaseLabel?.match(/v?\d+\.\d+\.\d+/)?.[0];
  if (releaseTag) {
    let release: { tag_name: string };
    try {
      release = githubJson<{ tag_name: string }>(`repos/${path}/releases/tags/${releaseTag}`);
    } catch (error) {
      throw new Error(`Release tag unavailable for ${project.name}: ${releaseTag}`, { cause: error });
    }
    assert.equal(release.tag_name, releaseTag, `Release tag mismatch for ${project.name}`);
  }

  console.info(`✓ ${project.name}: ${data.html_url} · ${data.default_branch} · pushed ${data.pushed_at}`);
}

console.info(`Verified ${PROJECTS.length} project repositories and release tags.`);

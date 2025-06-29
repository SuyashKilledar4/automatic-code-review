import { execSync } from 'child_process';
import { Octokit } from '@octokit/rest';
import fetch from 'node-fetch';
import { readFileSync } from 'fs';

const ignoreFiles = [
  '.github/pull_request_template.md',
  '.github/scripts/review.mjs',
  '.github/workflows/code-review.yml',
  '.gitignore',
  '.prettierignore',
  '.prettierrc',
  '.vscode/settings.json',
  'eslint.config.mjs',
  'jest.config.js',
  'main.js',
  'tests/tsconfig.json',
  'tsconfig.json',
  'package-lock.json',
  'package.json',
  'README.md'
];

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

async function getChangedFiles() {
  const prNumber = process.env.GITHUB_REF.split('/')[2];
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  const { data: files } = await octokit.pulls.listFiles({
    owner,
    repo,
    pull_number: prNumber
  });
  return files.map((file) => file.filename);
}

async function runESLint(files) {
  const results = execSync(`npx eslint ${files.join(' ')} -f json`).toString();
  return JSON.parse(results);
}

async function getAISuggestions(code) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a code reviewer.' },
          { role: 'user', content: `Review this code and suggest improvements:\n\n${code}` }
        ]
      })
    });
    if (!response.ok) {
      console.error(`OpenAI API error: ${response.status} ${response.statusText}`);
      return;
    }
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting AI suggestions:', error);
    return;
  }
}

async function postComment(body) {
  const prNumber = process.env.GITHUB_REF.split('/')[2];
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body
  });
}

(async () => {
  const changedFiles = await getChangedFiles();
  const files = changedFiles.filter(filename => !ignoreFiles.includes(filename));
  const lintResults = await runESLint(files);
  for (const result of lintResults) {
    const code = readFileSync(result.filePath, 'utf-8');
    const suggestion = await getAISuggestions(code);
    if (suggestion) {
      await postComment(`### LTIM Hackathon - Brotherhood \n\n ### :bulb: AI Suggestion for \`${result.filePath}\`\n\n${suggestion}`);
    }
  }
})();

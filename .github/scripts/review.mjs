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
  'eslint.config.js',
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
  try {
    const results = execSync(`npx eslint ${files.join(' ')} -f json`).toString();
    return JSON.parse(results);
  } catch (error) {
    if (error.stdout) {
      try {
        return JSON.parse(error.stdout.toString());
      } catch (parseErr) {
        console.error('Failed to parse ESLint output:', error.stdout.toString());
        return [];
      }
    } else {
      console.error('ESLint failed:', error);
      return [];
    }
  }
}

async function getAISuggestions(aiPrompt) {
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
          { role: 'user', content: `${aiPrompt}` }
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
  const comments = [];
  for (const result of lintResults) {
    const fileName = result.filePath.split(/[\\/]/).pop();
    const code = readFileSync(result.filePath, 'utf-8');
    for (const msg of result.messages) {
      const aiPrompt = `You are a code reviewer.\n` +
        `Here is the code for context:\n\n${code}\n\n` +
        `There is an ESLint error on line ${msg.line}: ${msg.message}.\n` +
        `Please suggest a fix for this specific line, and explain your suggestion.`;
      const suggestion = await getAISuggestions(aiPrompt);
      const comment = `**File:** ${fileName}\n` +
        `**Line:** ${msg.line}\n` +
        `**Error:** ${msg.message}\n` +
        `**:bulb: AI Suggestion:**\n${suggestion || 'No suggestion available.'}`;
      comments.push(comment);
    }
  }
  if (comments.length > 0) {
    comments.unshift('### LTIM Hackathon - Brotherhood\n\n');
    await postComment(comments.join('\n\n'));
  }
})();

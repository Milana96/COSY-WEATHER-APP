const { spawn } = require('child_process');
const path = require('path');

const RAG_SCRIPT = path.join(__dirname, '..', 'rag', 'query.py');

function runRagQuery(question, city, weather) {
  return new Promise((resolve, reject) => {
    const python = process.env.PYTHON_BIN || 'python3';
    const args = [RAG_SCRIPT, question];

    const child = spawn(python, args, {
      cwd: path.join(__dirname, '..'),
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(stderr || 'RAG query failed'));
        return;
      }

      try {
        const parsed = JSON.parse(stdout.trim());
        resolve(parsed);
      } catch (error) {
        reject(new Error('Failed to parse RAG response'));
      }
    });
  });
}

module.exports = { runRagQuery };

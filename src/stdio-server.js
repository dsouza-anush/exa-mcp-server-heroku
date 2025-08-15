#!/usr/bin/env node

// Simple stdio server for Heroku MCP
// Based on the Python sample at https://github.com/heroku/mcp-code-exec-python

// Import the server and run it with stdio transport
import { exec } from 'child_process';

// Log startup
console.log('Starting MCP STDIO server...');

// Run the server with stdio transport
// We're using the built stdio version directly
try {
  // Execute the command with stdio passed through
  const cmd = 'node ./.smithery/index.cjs --transport stdio';
  const child = exec(cmd, {
    stdio: ['pipe', 'pipe', 'pipe']
  });

  // Connect stdin/stdout
  process.stdin.pipe(child.stdin);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  // Handle exit
  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`MCP server exited with code ${code}`);
      process.exit(code);
    }
  });

  // Handle errors
  child.on('error', (err) => {
    console.error('Error starting MCP server:', err);
    process.exit(1);
  });

  // Handle process signals
  process.on('SIGINT', () => {
    child.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    child.kill('SIGTERM');
  });

} catch (error) {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
}
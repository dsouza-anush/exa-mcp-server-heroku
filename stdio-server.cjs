#!/usr/bin/env node

/**
 * MCP STDIO Server for Heroku
 * 
 * This is a CommonJS version to avoid ESM compatibility issues
 */

// Configure error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down.');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down.');
  process.exit(0);
});

// The simplest approach: Call the prebuilt stdio server directly
try {
  console.log('Starting Exa MCP STDIO server...');

  // Use the prebuilt stdio server (built in heroku-postbuild)
  const path = require('path');
  const { spawn } = require('child_process');
  
  // Run the prebuilt stdio server with proper stdio redirection
  const serverPath = path.join(__dirname, '.smithery', 'index.cjs');
  
  const server = spawn('node', [serverPath, '--transport', 'stdio'], {
    stdio: ['pipe', 'pipe', 'pipe']
  });
  
  // Connect standard IO
  process.stdin.pipe(server.stdin);
  server.stdout.pipe(process.stdout);
  server.stderr.pipe(process.stderr);
  
  // Handle server process events
  server.on('error', (err) => {
    console.error('Failed to start MCP server:', err);
    process.exit(1);
  });
  
  server.on('exit', (code) => {
    if (code !== 0) {
      console.error(`MCP server exited with code ${code}`);
    }
    process.exit(code);
  });
  
} catch (error) {
  console.error('Error starting MCP server:', error);
  process.exit(1);
}
#!/usr/bin/env node

// Direct stdio server for Heroku MCP
// This script is designed to be called directly from the Procfile
// without any npm run wrapper which could cause issues with stdio handling

// Import the compiled MCP server
const server = require('./.smithery/index.cjs');

// Exit handler for graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down.');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down.');
  process.exit(0);
});

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

// Process is kept alive by the server
console.log('MCP stdio server started');
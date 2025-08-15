#!/usr/bin/env node

/**
 * Runs the server in STDIO mode.
 * 
 * Note: This file is referenced in the Procfile for STDIO mode. It boots up and runs once per request
 * conversation initialization, exactly like the Python sample.
 */

// Configure environment
process.env.NODE_ENV = 'production';

// Handle errors
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

// Import the tools server setup function
import { setupToolsServer } from './set-up-tools.js';

// Create the MCP server
const mcpServer = setupToolsServer();

// Run the server in stdio mode
try {
  console.log('Starting MCP STDIO server...');
  mcpServer.run({ transport: "stdio" });
} catch (error) {
  console.error('Error running MCP server in stdio mode:', error);
  process.exit(1);
}
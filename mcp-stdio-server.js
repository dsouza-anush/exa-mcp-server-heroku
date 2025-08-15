#!/usr/bin/env node

/**
 * Direct stdio server for Heroku MCP
 * This script connects directly to stdin/stdout for MCP communication
 * Based on the Python sample from Heroku
 */

// Set NODE_ENV to production
process.env.NODE_ENV = 'production';

// Set up error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at Promise:', promise, 'Reason:', reason);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down.');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down.');
  process.exit(0);
});

// Directly import the MCP SDK
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const z = require('zod');

// Import tool implementations directly from source
const registerWebSearchTool = require('./src/tools/webSearch.js').registerWebSearchTool;
const registerCompanyResearchTool = require('./src/tools/companyResearch.js').registerCompanyResearchTool;
const registerCrawlingTool = require('./src/tools/crawling.js').registerCrawlingTool;
const registerLinkedInSearchTool = require('./src/tools/linkedInSearch.js').registerLinkedInSearchTool;
const registerDeepResearchStartTool = require('./src/tools/deepResearchStart.js').registerDeepResearchStartTool;
const registerDeepResearchCheckTool = require('./src/tools/deepResearchCheck.js').registerDeepResearchCheckTool;
const log = require('./src/utils/logger.js').log;

// Tool registry for managing available tools
const availableTools = {
  'web_search_exa': { name: 'Web Search (Exa)', description: 'Real-time web search using Exa AI', enabled: true },
  'company_research_exa': { name: 'Company Research', description: 'Research companies and organizations', enabled: true },
  'crawling_exa': { name: 'Web Crawling', description: 'Extract content from specific URLs', enabled: true },
  'linkedin_search_exa': { name: 'LinkedIn Search', description: 'Search LinkedIn profiles and companies', enabled: true },
  'deep_researcher_start': { name: 'Deep Researcher Start', description: 'Start a comprehensive AI research task', enabled: true },
  'deep_researcher_check': { name: 'Deep Researcher Check', description: 'Check status and retrieve results of research task', enabled: true }
};

// Configuration for the MCP server
const config = {
  exaApiKey: process.env.EXA_API_KEY,
  enabledTools: process.env.ENABLED_TOOLS ? process.env.ENABLED_TOOLS.split(',') : null,
  debug: process.env.DEBUG === 'true'
};

// Helper function to check if a tool should be registered
const shouldRegisterTool = (toolId) => {
  if (config.enabledTools && config.enabledTools.length > 0) {
    return config.enabledTools.includes(toolId);
  }
  return availableTools[toolId]?.enabled ?? false;
};

// Create MCP server
try {
  console.log('Starting Exa MCP Server in stdio mode...');
  
  if (config.debug) {
    console.log('Debug mode enabled');
  }

  const server = new McpServer({
    name: "exa-search-server",
    version: "2.0.3"
  });
  
  // Register tools based on configuration
  const registeredTools = [];
  
  if (shouldRegisterTool('web_search_exa')) {
    registerWebSearchTool(server, config);
    registeredTools.push('web_search_exa');
  }
  
  if (shouldRegisterTool('company_research_exa')) {
    registerCompanyResearchTool(server, config);
    registeredTools.push('company_research_exa');
  }
  
  if (shouldRegisterTool('crawling_exa')) {
    registerCrawlingTool(server, config);
    registeredTools.push('crawling_exa');
  }
  
  if (shouldRegisterTool('linkedin_search_exa')) {
    registerLinkedInSearchTool(server, config);
    registeredTools.push('linkedin_search_exa');
  }
  
  if (shouldRegisterTool('deep_researcher_start')) {
    registerDeepResearchStartTool(server, config);
    registeredTools.push('deep_researcher_start');
  }
  
  if (shouldRegisterTool('deep_researcher_check')) {
    registerDeepResearchCheckTool(server, config);
    registeredTools.push('deep_researcher_check');
  }
  
  console.log(`Registered ${registeredTools.length} tools: ${registeredTools.join(', ')}`);

  // Run the server in stdio mode
  server.server.run({ transport: "stdio" });
  
} catch (error) {
  console.error(`Server initialization error:`, error);
  process.exit(1);
}
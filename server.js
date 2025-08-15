#!/usr/bin/env node
'use strict';

/**
 * Exa MCP Server for Heroku
 * 
 * This implementation follows the pattern used by the working BrightData MCP server
 */

// Import required modules
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Import tool implementations
import { registerWebSearchTool } from "./src/tools/webSearch.js";
import { registerCompanyResearchTool } from "./src/tools/companyResearch.js";
import { registerCrawlingTool } from "./src/tools/crawling.js";
import { registerLinkedInSearchTool } from "./src/tools/linkedInSearch.js";
import { registerDeepResearchStartTool } from "./src/tools/deepResearchStart.js";
import { registerDeepResearchCheckTool } from "./src/tools/deepResearchCheck.js";
import { log } from "./src/utils/logger.js";

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

// Tool registry for managing available tools
const availableTools = {
  'web_search_exa': { name: 'Web Search (Exa)', description: 'Real-time web search using Exa AI', enabled: true },
  'company_research_exa': { name: 'Company Research', description: 'Research companies and organizations', enabled: true },
  'crawling_exa': { name: 'Web Crawling', description: 'Extract content from specific URLs', enabled: true },
  'linkedin_search_exa': { name: 'LinkedIn Search', description: 'Search LinkedIn profiles and companies', enabled: true },
  'deep_researcher_start': { name: 'Deep Researcher Start', description: 'Start a comprehensive AI research task', enabled: true },
  'deep_researcher_check': { name: 'Deep Researcher Check', description: 'Check status and retrieve results of research task', enabled: true }
};

// Create and configure MCP server
try {
  // Get configuration from environment
  const exaApiKey = process.env.EXA_API_KEY;
  const enabledToolsStr = process.env.ENABLED_TOOLS;
  const enabledTools = enabledToolsStr ? enabledToolsStr.split(',') : null;
  const debug = process.env.DEBUG === 'true';
  
  // Create configuration object
  const config = {
    exaApiKey,
    enabledTools,
    debug
  };
  
  if (debug) {
    log("Starting Exa MCP Server in debug mode");
  }

  // Create MCP server
  const server = new McpServer({
    name: "exa-search-server",
    version: "2.0.3"
  });
  
  log("Server initialized with MCP SDK");

  // Helper function to check if a tool should be registered
  const shouldRegisterTool = (toolId) => {
    if (config.enabledTools && config.enabledTools.length > 0) {
      return config.enabledTools.includes(toolId);
    }
    return availableTools[toolId]?.enabled ?? false;
  };

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
  
  if (debug) {
    log(`Registered ${registeredTools.length} tools: ${registeredTools.join(', ')}`);
  }

  // Determine if this is a web or MCP process
  const isMcpProcess = process.env.DYNO && process.env.DYNO.startsWith('mcp-');

  // Start the server with the appropriate transport type
  if (isMcpProcess) {
    console.log('Starting MCP server with stdio transport');
    server.server.run({ transport: "stdio" });
  } else {
    console.log('Starting HTTP server on port', process.env.PORT || 8000);
    server.server.run({ 
      transport: "http",
      port: process.env.PORT || 8000
    });
  }
  
} catch (error) {
  log(`Server initialization error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
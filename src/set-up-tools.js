/**
 * This module registers this repo's tools with the MCP SDK and creates a server object.
 * It does not run the server. This follows the pattern from the Python sample.
 * 
 * Following the Python sample architecture to keep code clarity and separation of concerns.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Import tool implementations
import { registerWebSearchTool } from "./tools/webSearch.js";
import { registerCompanyResearchTool } from "./tools/companyResearch.js";
import { registerCrawlingTool } from "./tools/crawling.js";
import { registerLinkedInSearchTool } from "./tools/linkedInSearch.js";
import { registerDeepResearchStartTool } from "./tools/deepResearchStart.js";
import { registerDeepResearchCheckTool } from "./tools/deepResearchCheck.js";
import { log } from "./utils/logger.js";

// Tool registry for managing available tools
const availableTools = {
  'web_search_exa': { name: 'Web Search (Exa)', description: 'Real-time web search using Exa AI', enabled: true },
  'company_research_exa': { name: 'Company Research', description: 'Research companies and organizations', enabled: true },
  'crawling_exa': { name: 'Web Crawling', description: 'Extract content from specific URLs', enabled: true },
  'linkedin_search_exa': { name: 'LinkedIn Search', description: 'Search LinkedIn profiles and companies', enabled: true },
  'deep_researcher_start': { name: 'Deep Researcher Start', description: 'Start a comprehensive AI research task', enabled: true },
  'deep_researcher_check': { name: 'Deep Researcher Check', description: 'Check status and retrieve results of research task', enabled: true }
};

/**
 * Sets up and configures the MCP server with the appropriate tools based on environment
 * @returns {Object} The configured MCP server
 */
export function setupToolsServer() {
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
    
    log("Server initialized with modern MCP SDK support");

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
    
    // Return the server object
    return server.server;
    
  } catch (error) {
    log(`Server initialization error: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}
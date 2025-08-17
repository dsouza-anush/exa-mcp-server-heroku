# Exa MCP Server 🔍

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/dsouza-anush/exa-mcp-server-heroku)

[![npm version](https://badge.fury.io/js/exa-mcp-server.svg)](https://www.npmjs.com/package/exa-mcp-server)
[![smithery badge](https://smithery.ai/badge/exa)](https://smithery.ai/server/exa)

A Model Context Protocol (MCP) server lets AI assistants like Claude use the Exa AI Search API for web searches. This setup allows AI models to get real-time web information in a safe and controlled way.

<a href="https://glama.ai/mcp/servers/@dsouza-anush/exa-mcp-server-heroku">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@dsouza-anush/exa-mcp-server-heroku/badge" alt="Exa Server MCP server" />
</a>

## Remote Exa MCP 🌐

Connect directly to Exa's hosted MCP server (instead of running it locally).

### Remote Exa MCP URL

```
https://mcp.exa.ai/mcp?exaApiKey=your-exa-api-key
```

Replace `your-api-key-here` with your actual Exa API key from [dashboard.exa.ai/api-keys](https://dashboard.exa.ai/api-keys).

### Claude Desktop Configuration for Remote MCP

Add this to your Claude Desktop configuration file:

```json
{
  "mcpServers": {
    "exa": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://mcp.exa.ai/mcp?exaApiKey=your-exa-api-key"
      ]
    }
  }
}
```

### NPM Installation

```bash
npm install -g exa-mcp-server
```

### Using Claude Code

```bash
claude mcp add exa -e EXA_API_KEY=YOUR_API_KEY -- npx -y exa-mcp-server
```

### Using Smithery

To install the Exa MCP server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/exa):

```bash
npx -y @smithery/cli install exa --client claude
```

## Configuration ⚙️

### 1. Configure Claude Desktop to recognize the Exa MCP server

You can find claude_desktop_config.json inside the settings of Claude Desktop app:

Open the Claude Desktop app and enable Developer Mode from the top-left menu bar. 

Once enabled, open Settings (also from the top-left menu bar) and navigate to the Developer Option, where you'll find the Edit Config button. Clicking it will open the claude_desktop_config.json file, allowing you to make the necessary edits. 

OR (if you want to open claude_desktop_config.json from terminal)

#### For macOS:

1. Open your Claude Desktop configuration:

```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

#### For Windows:

1. Open your Claude Desktop configuration:

```powershell
code %APPDATA%\Claude\claude_desktop_config.json
```

### 2. Add the Exa server configuration:

```json
{
  "mcpServers": {
    "exa": {
      "command": "npx",
      "args": ["-y", "exa-mcp-server"],
      "env": {
        "EXA_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Replace `your-api-key-here` with your actual Exa API key from [dashboard.exa.ai/api-keys](https://dashboard.exa.ai/api-keys).

### 3. Available Tools & Tool Selection

The Exa MCP server includes the following tools, which can be enabled by adding the `--tools`:

- **web_search_exa**: Performs real-time web searches with optimized results and content extraction.
- **company_research**: Comprehensive company research tool that crawls company websites to gather detailed information about businesses.
- **crawling**: Extracts content from specific URLs, useful for reading articles, PDFs, or any web page when you have the exact URL.
- **linkedin_search**: Search LinkedIn for companies and people using Exa AI. Simply include company names, person names, or specific LinkedIn URLs in your query.
- **deep_researcher_start**: Start a smart AI researcher for complex questions. The AI will search the web, read many sources, and think deeply about your question to create a detailed research report.
- **deep_researcher_check**: Check if your research is ready and get the results. Use this after starting a research task to see if it's done and get your comprehensive report.

You can choose which tools to enable by adding the `--tools` parameter to your Claude Desktop configuration:

#### Specify which tools to enable:

```json
{
  "mcpServers": {
    "exa": {
      "command": "npx",
      "args": [
        "-y",
        "exa-mcp-server",
        "--tools=web_search_exa,company_research,crawling,linkedin_search,deep_researcher_start,deep_researcher_check"
      ],
      "env": {
        "EXA_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

For enabling multiple tools, use a comma-separated list:

```json
{
  "mcpServers": {
    "exa": {
      "command": "npx",
      "args": [
        "-y",
        "exa-mcp-server",
        "--tools=web_search_exa,company_research,crawling,linkedin_search,deep_researcher_start,deep_researcher_check"
      ],
      "env": {
        "EXA_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

If you don't specify any tools, all tools enabled by default will be used.

### 4. Restart Claude Desktop

For the changes to take effect:

1. Completely quit Claude Desktop (not just close the window)
2. Start Claude Desktop again
3. Look for the icon to verify the Exa server is connected

## Using via NPX

If you prefer to run the server directly, you can use npx:

```bash
# Run with all tools enabled by default
npx exa-mcp-server

# Enable specific tools only
npx exa-mcp-server --tools=web_search_exa

# Enable multiple tools
npx exa-mcp-server --tools=web_search_exa,company_research

# List all available tools
npx exa-mcp-server --list-tools
```

## Troubleshooting 🔧

### Common Issues

1. **Server Not Found**
   * Verify the npm link is correctly set up
   * Check Claude Desktop configuration syntax (json file)

2. **API Key Issues**
   * Confirm your EXA_API_KEY is valid
   * Check the EXA_API_KEY is correctly set in the Claude Desktop config
   * Verify no spaces or quotes around the API key

3. **Connection Issues**
   * Restart Claude Desktop completely
   * Check Claude Desktop logs:

<br>

---

Built with ❤️ by team Exa

## Deploy to Heroku 🚀

You can deploy this MCP server to Heroku with one click using the Heroku Button:

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/dsouza-anush/exa-mcp-server-heroku)

### Manual Heroku Deployment

If you prefer to deploy manually:

1. Clone this repository:
   ```bash
   git clone https://github.com/dsouza-anush/exa-mcp-server-heroku.git
   cd exa-mcp-server-heroku
   ```

2. Create a new Heroku app:
   ```bash
   heroku create
   ```

3. Set your Exa API key as a config variable:
   ```bash
   heroku config:set EXA_API_KEY=your-api-key-here
   ```

4. Optionally, specify which tools to enable:
   ```bash
   heroku config:set ENABLED_TOOLS=web_search_exa,company_research_exa,crawling_exa
   ```

5. Deploy to Heroku:
   ```bash
   git push heroku main
   ```

## Using with Heroku Inference and Agents 🤖

This MCP server is fully compatible with Heroku Managed Inference and Agents. To use it:

1. Deploy the MCP server to Heroku using the steps above.

2. Attach the MCP server to a Heroku Managed Inference and Agents chat model:

   ```bash
   # Replace APP_NAME with your Heroku app name
   # Replace MODEL_NAME with your desired model name
   heroku ai:models:create MODEL_NAME -a APP_NAME --as INFERENCE
   ```

3. Your MCP server will be automatically registered with Heroku Inference and its tools will be available via the `/v1/agents/heroku` endpoint.

### MCP Server Configuration

This server uses the following Procfile configuration for Heroku Inference:

```
web: npm run serve
mcp-search-exa: node ./stdio-server.js
```

The `mcp-search-exa` process is registered with Heroku Inference, following the naming convention required by Heroku (process names must start with "mcp"). The direct Node.js execution ensures proper stdio handling for the MCP protocol.

Both web and mcp-search-exa dynos are configured to scale to 0 by default in the app.json, following Heroku's recommendation for MCP servers. When you attach this app to a Heroku Inference model, Heroku will automatically scale the MCP process as needed for tool execution.

### Using with Claude Desktop

To use your Heroku-deployed MCP server with Claude Desktop:

1. Add this to your Claude Desktop configuration file:

```json
{
  "mcpServers": {
    "exa_heroku": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://your-app-name.herokuapp.com/mcp"
      ],
      "env": {
        "EXA_API_KEY": "your-api-key-here" 
      }
    }
  }
}
```

Replace `your-app-name` with your Heroku app name and `your-api-key-here` with your Exa API key.

### Using with Claude Code CLI

```bash
claude mcp add exa_heroku -e EXA_API_KEY=YOUR_API_KEY -- npx -y mcp-remote https://your-app-name.herokuapp.com/mcp
```

Replace `your-app-name` with your Heroku app name and `YOUR_API_KEY` with your Exa API key.

## Keeping Updated with Upstream 🔄

This repository **automatically updates daily** from the original exa-mcp-server repository while preserving all Heroku-specific customizations. Updates are handled through GitHub Actions.

### Automatic Updates

A GitHub Actions workflow runs daily to:
- Fetch the latest changes from the original exa-mcp-server repository
- Preserve all Heroku-specific customizations (app.json, Procfile, etc.)
- Commit and push the updated code

You can also trigger an update manually by:
1. Going to the "Actions" tab in the GitHub repository
2. Selecting the "Auto Update from Upstream" workflow
3. Clicking "Run workflow"

### Manual Updates

If you prefer to update manually, you can use the included update script:

1. Clone your forked repository:
   ```bash
   git clone https://github.com/your-username/exa-mcp-server-heroku.git
   cd exa-mcp-server-heroku
   ```

2. Run the update script:
   ```bash
   ./update-from-upstream.sh
   ```

3. Review the changes, then commit and push to your repository:
   ```bash
   git commit -am "Updated from upstream with Heroku customizations"
   git push origin main
   ```

4. If you have already deployed to Heroku, update your Heroku app:
   ```bash
   git push heroku main
   ```

The update process preserves all Heroku-specific customizations, including:
- Heroku button configuration (app.json)
- Process definitions (Procfile)
- Environment variable handling
- Heroku-specific scripts
- Deployment instructions
# mcp

- [Installation](https://docs.deno.com/runtime/getting_started/installation/)

  ```sh
  brew install deno
  ```

- [Deno & Visual Studio Code](https://docs.deno.com/runtime/reference/vscode/)
- [やさしいMCP入門 - Speaker Deck](https://speakerdeck.com/minorun365/yasasiimcpru-men)
- [MCPを超理解する #ポエム - Qiita](https://qiita.com/ak-sasaki0919/items/b216a06b0ef33536fc3b)
- [なぜ MCP なのか](https://voluntas.ghost.io/why-mcp/)
- [MCPに入門する/ Introduction to MCP - Speaker Deck](https://speakerdeck.com/shuntaka/introduction-to-mcp)
- [Deno で RooCode 用にローカルMCPサーバーをさっと作る](https://zenn.dev/mizchi/articles/deno-mcp-server)

  ```sh
  deno test ./server/index.ts
  ```

- [VS Code の設定から MCPサーバーを追加して GitHub Copilot agent mode で利用してみる（安定版でも利用可能に） #VSCode - Qiita](https://qiita.com/youtoy/items/adfeedeedf1309f194ce)

  ```json
  {
    "mcpServers": {
      "local": {
        "command": "/opt/homebrew/bin/deno",
        "args": ["run", "/Users/fkesys/GitHub/2754github/mcp/server/index.ts"]
      }
    }
  }
  ```

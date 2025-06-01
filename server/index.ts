import { Server } from "npm:@modelcontextprotocol/sdk@1.5.0/server/index.js";
import { StdioServerTransport } from "npm:@modelcontextprotocol/sdk@1.5.0/server/stdio.js";
import {
  CallToolRequest,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "npm:@modelcontextprotocol/sdk@1.5.0/types.js";
import { generateId } from "./generateId.ts";

const tools: Tool[] = [
  {
    name: "generateId",
    description: "Generate ID of a given length",
    inputSchema: {
      type: "object",
      properties: {
        length: {
          type: "number",
          description: "Length of ID to be generated",
        },
      },
      required: [
        "length",
      ],
    },
  },
];

const server = new Server(
  {
    name: "local",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {
        generateId: tools[0],
      },
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, () => {
  return { tools };
});

server.setRequestHandler(CallToolRequestSchema, (request: CallToolRequest) => {
  const name = request.params.name;
  const args = request.params.arguments ?? {};

  switch (name) {
    case "generateId": {
      const { length } = args;
      if (typeof length !== "number") {
        return {
          content: [
            {
              type: "text",
              text: `Invalid type of length: ${typeof length}`,
            },
          ],
          isError: true,
        };
      }

      const id = generateId(length);

      return {
        content: [
          {
            type: "text",
            text: id,
          },
        ],
        isError: false,
      };
    }
    default: {
      return {
        content: [
          {
            type: "text",
            text: `Unknown tool: ${name}`,
          },
        ],
        isError: true,
      };
    }
  }
});

await server.connect(new StdioServerTransport());

import { expect } from "jsr:@std/expect@1";
import { Client } from "npm:@modelcontextprotocol/sdk@1.5.0/client/index.js";
import { InMemoryTransport } from "npm:@modelcontextprotocol/sdk@1.5.0/inMemory.js";

Deno.test("mcp", async () => {
  const client = new Client(
    {
      name: "test",
      version: "1.0.0",
    },
    {
      capabilities: {},
    },
  );
  const [clientTransport, serverTransport] = InMemoryTransport
    .createLinkedPair();
  await Promise.all([
    client.connect(clientTransport),
    server.connect(serverTransport),
  ]);

  const testCases = [
    {
      tool: {
        name: "generateId",
        arguments: {
          length: null,
        },
      },
      expected: {
        content: [
          {
            type: "text",
            text: "Invalid type of length: object",
          },
        ],
        isError: true,
      },
    },
    {
      tool: {
        name: "generateId",
        arguments: {
          length: "28",
        },
      },
      expected: {
        content: [
          {
            type: "text",
            text: "Invalid type of length: string",
          },
        ],
        isError: true,
      },
    },
    {
      tool: {
        name: "generateId",
        arguments: {
          length: 28,
        },
      },
      expected: {
        content: [
          {
            type: "text",
            text: expect.stringMatching(/^[0-9ACEFHJKLMNPRTUVWXY]{28}$/),
          },
        ],
        isError: false,
      },
    },
  ];

  for (const testCase of testCases) {
    const { tool, expected } = testCase;

    const actual = await client.callTool(tool);

    expect(actual).toStrictEqual(expected);
  }
});

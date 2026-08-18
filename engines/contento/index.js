import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Core FFmpeg logic from Contento's render-executor.ts
async function renderVideo(inputPath, watermarkText, outputName) {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input video not found: ${inputPath}`);
  }

  const outputDir = path.join(process.cwd(), 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `${outputName || 'video-' + Date.now()}.mp4`);
  
  const escapedWatermark = watermarkText.replace(/([\\:'%])/g, '\\$1');
  const videoFilter = `scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(1080-iw)/2:(1920-ih)/2,drawtext=text='${escapedWatermark}':fontcolor=white@0.9:fontsize=40:x=40:y=55:box=1:boxcolor=black@0.35:boxborderw=10`;

  const args = [
    '-y',
    '-i', inputPath,
    '-vf', videoFilter,
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '24',
    '-c:a', 'copy',
    outputPath
  ];

  execFileSync('ffmpeg', args, { encoding: 'utf8' });
  return outputPath;
}

const server = new Server(
  {
    name: 'socio-contento-engine',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'contento_render_video',
        description: 'Compiles a video using Contento FFmpeg engine with 9:16 crop and watermark.',
        inputSchema: {
          type: 'object',
          properties: {
            inputPath: {
              type: 'string',
              description: 'Absolute path to the input video file.'
            },
            watermarkText: {
              type: 'string',
              description: 'Text to burn into the top-left of the video.'
            },
            outputName: {
              type: 'string',
              description: 'Optional filename for the output video.'
            }
          },
          required: ['inputPath', 'watermarkText'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'contento_render_video') {
    const { inputPath, watermarkText, outputName } = request.params.arguments;
    try {
      const resultPath = await renderVideo(inputPath, watermarkText, outputName);
      return {
        content: [{ type: 'text', text: `Video successfully rendered to: ${resultPath}` }],
      };
    } catch (err) {
      return {
        content: [{ type: 'text', text: `Render failed: ${err.message}` }],
        isError: true,
      };
    }
  }

  throw new Error('Tool not found');
});

const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);

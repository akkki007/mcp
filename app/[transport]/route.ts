import { createMcpHandler } from "@vercel/mcp-adapter";
import z from "zod";

const handler = createMcpHandler((server) => {
  server.tool(
    "course_recommender",
    "listing of all the courses available in linkcode",
    {
        experience_level:z.enum(["beginner","intermediate"]),
    },
    ({experience_level})=>{
        return {
            content:[
                {
                    type:"text",
                    text: `I recommend you take the ${
                    experience_level === "beginner"
                    ? "Professional Javascript"
                    : "Professional React & Next.js"
                    } course.`,
                },
            ],
        };
    })
}, {
  capabilities: {
    tools: {
      course_recommender:{
        description:"Give a course recommendation based on experience level"
      },
    }
  }
}, {
  redisUrl: process.env.REDIS_URL,
  sseEndpoint: "/sse",
  streamableHttpEndpoint: "/mcp",
  verboseLogs: true,
  maxDuration: 60
});

// Wrap the handler to add CORS headers
const corsHandler = async (request: Request) => {
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // Call the original handler
  const response = await handler(request);
  
  // Add CORS headers to the response
  const corsResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      ...Object.fromEntries(response.headers.entries()),
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });

  return corsResponse;
};

export { corsHandler as GET, corsHandler as POST, corsHandler as DELETE, corsHandler as OPTIONS };
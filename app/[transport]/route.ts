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

export { handler as GET, handler as POST,handler as DELETE };
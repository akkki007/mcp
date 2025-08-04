"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!input.trim()) return;
    
    setLoading(true);
    try {
      // Determine experience level based on input (you can modify this logic)
      const experienceLevel = input.toLowerCase().includes("beginner") || 
                             input.toLowerCase().includes("new") || 
                             input.toLowerCase().includes("start") 
                             ? "beginner" : "intermediate";

      // Make request to your MCP server
      const mcpRequest = {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: "course_recommender",
          arguments: {
            experience_level: experienceLevel
          }
        }
      };

      const response = await fetch('https://mcp-six-rose.vercel.app/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mcpRequest)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract the text from the MCP response
      if (data.result && data.result.content && data.result.content[0]) {
        setResponse(data.result.content[0].text);
      } else {
        setResponse("No recommendation received");
      }
      
    } catch (error) {
      console.error('Error calling MCP server:', error);
      setResponse('Error getting course recommendation');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col w-[60vw] mt-32 mx-[20vw] gap-5">
      <h1 className="tracking-tighter text-center text-3xl font-bold">
        Next.js + MCP Course Recommender
      </h1>
      
      <div className="space-y-4">
        <Input 
          placeholder="Tell me about your experience level (e.g., 'I'm a beginner' or 'I have some experience')" 
          value={input}
          onChange={(event) => {
            setInput(event.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
        
        <Button 
          className="font-light tracking-widest cursor-pointer w-full" 
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
        >
          {loading ? "Getting Recommendation..." : "Get Course Recommendation"}
        </Button>
      </div>

      {response && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-2">Recommendation:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
"use client";
import { useState } from "react";

export default function Home() {
  const [theInput, setTheInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content: "Yo, this ChatterBot! How can I help you today?",
    },
  ]);

  const callGetResponse = async () => {
    setIsLoading(true);
    const temp = messages;
    temp.push({ role: "user", content: theInput });
    setMessages(temp);
    setTheInput("");

    console.log("Calling OpenAI with input:", theInput);
    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch response from OpenAI");
      }

      const { output } = data;
      console.log("OpenAI replied...", output.content);

      setMessages((prev) => [...prev, output]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: (error as Error).message },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const Submit = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    callGetResponse();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 py-5">
      <h1 className="text-3xl font-sans">ChatterBot</h1>
      <div className="flex h-[35rem] w-[40rem] flex-col items-center bg-gray-600 rounded-xl">
        <div className="h-full flex flex-col gap-2 overflow-y-auto py-8 px-3 w-full">
          {messages.map((e, i) => {
            return (
              <div
                key={`${e.content}-${i}`}
                className={`w-max max-w-[18rem] rounded-md px-4 py-3 h-min ${
                  e.role === "assistant"
                    ? "self-start bg-gray-200 text-gray-800"
                    : "self-end bg-gray-800 text-gray-50"
                } break-inside-auto wrap-break-word`}
              >
                <p className="text-sm">{e.content}</p>
              </div>
            );
          })}

          {isLoading && (
            <div className="w-max max-w-[18rem] rounded-md px-4 py-3 h-min self-start bg-gray-200 text-gray-800">
              <p className="text-sm">Thinking...</p>
            </div>
          )}
        </div>
        <div className="relative w-[80%] bottom-4 flex justify-center">
          <textarea
            value={theInput}
            onChange={(e) => setTheInput(e.target.value)}
            className="w-[85%] h-10 px-3 py-2 resize-none overflow-y-auto text-black bg-gray-300 rounded-l outline-none"
            onKeyDown={Submit}
            placeholder="Type your message here..."
          />
          <button
            onClick={callGetResponse}
            className="w-[20%] bg-background px-4 py-2 rounded-r"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Send"}
          </button>
        </div>
      </div>

      <div></div>
    </main>
  );
}

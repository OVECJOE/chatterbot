"use client";
import { useState, useRef, useEffect } from "react";
import { AudioTranscribe } from "./components";

export default function Home() {
  const [textInput, setTextInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content: "Yo, this ChatterBot! How can I help you today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callGetResponse = async () => {
    setIsLoading(true);
    const temp = messages;
    temp.push({ role: "user", content: textInput });
    setMessages(temp);
    setTextInput("");

    console.log("Calling OpenAI with input:", textInput);
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

  const UpdateCaption = (caption: string, userType: "assistant" | "user" = "assistant") => {
    setMessages((prev) => [...prev, { role: userType, content: caption }]);
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
      <div className="flex h-[35rem] w-[40rem] flex-col items-center bg-amber-50 rounded-xl">
        <div className="h-full flex flex-col gap-2 overflow-y-auto py-8 px-3 w-full scroll-smooth">
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
          <div ref={messagesEndRef} />
        </div>
        <div className="relative w-[80%] bottom-4 flex justify-center items-center">
          <AudioTranscribe updateCaption={UpdateCaption} />
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="w-[85%] h-10 px-3 py-2 resize-none overflow-y-auto text-slate-800 bg-amber-200 rounded-l outline-none"
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
    </main>
  );
}

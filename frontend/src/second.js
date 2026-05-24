import React from "react";
import { useNavigate } from "react-router-dom";
export default function Chatpage() {
  const navigate = useNavigate();

  const handleNewChat = () => {
    // create unique thread id
    const threadId = crypto.randomUUID();

    // store in localStorage
    localStorage.setItem("thread_id", threadId);

    // move to chat page
    navigate("/chat");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 flex items-center justify-center p-6">
      <div className="bg-zinc-900/80 border border-zinc-700 rounded-3xl shadow-2xl p-10 w-full max-w-xl text-center backdrop-blur-lg">
        <h1 className="text-5xl font-bold text-white mb-4">
          Hello Saksham 👋
        </h1>

        <p className="text-zinc-400 text-lg mb-10">
          Welcome to your AI Email Sending Agent
        </p>

        <button
          onClick={handleNewChat}
          className="bg-white text-black px-8 py-4 rounded-2xl font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg"
        >
          + New Chat
        </button>
      </div>
    </div>
  );
}
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EmailAgentUI() {

const [input, setinput] = useState("");
const [showError, setshowError] = useState(false);

const [threads, setthreads] = useState([]);

const [history, sethistory] = useState([
{
role: "agent",
message:
"Hello Saksham 👋 I can help you write, draft, and automate emails.",
},
]);

const chatRef = useRef(null);



// ================= CREATE THREAD IF NOT EXISTS =================
useEffect(() => {

if (!localStorage.getItem("thread_id")) {

localStorage.setItem(
"thread_id",
crypto.randomUUID()
);

}

}, []);



// ================= GET THREAD ID =================
const threadid = localStorage.getItem("thread_id");



// ================= NEW CHAT =================
const createnewchat = () => {

const newthreadid = crypto.randomUUID();

localStorage.setItem(
"thread_id",
newthreadid
);

sethistory([
{
role: "agent",
message:
"Hello Saksham 👋 I can help you write, draft, and automate emails.",
},
]);

window.location.reload();

};



// ================= FETCH ALL THREADS =================
useEffect(() => {

fetch("http://127.0.0.1:8000/allthreads")
.then((res) => res.json())
.then((data) => {

setthreads(data.threads);

})
.catch((err) => console.log(err));

}, []);



// ================= AUTO SCROLL =================
useEffect(() => {

chatRef.current?.scrollIntoView({
behavior: "smooth",
});

}, [history]);



// ================= SEND MESSAGE =================
const handlingrequest = async () => {

if (!input.trim()) return;

if (input.length > 1000) {

setshowError(true);

setTimeout(() => {
setshowError(false);
}, 2500);

return;
}

const userMessage = {
role: "user",
message: input,
};

sethistory((prev) => [
...prev,
userMessage
]);

const currentInput = input;

setinput("");

try {

const response = await fetch(
"http://127.0.0.1:8000/sentdataagent",
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
text: currentInput,
threadids: threadid,
}),
}
);

const data = await response.json();

setTimeout(() => {

sethistory((prev) => [
...prev,
{
role: "agent",
message: data.reply,
},
]);

}, 200);

} catch (error) {

sethistory((prev) => [
...prev,
{
role: "agent",
message: "Server error occurred.",
},
]);

console.log(error);

}

};



// ================= LOAD THREAD =================
const loadthread = (
messages,
thread
) => {

localStorage.setItem(
"thread_id",
thread
);

sethistory(messages);

};



return (

<div className="h-screen bg-slate-950 text-white flex overflow-hidden">

{/* ERROR POPUP */}
<AnimatePresence>

{showError && (

<motion.div
initial={{
opacity: 0,
y: -50,
}}
animate={{
opacity: 1,
y: 0,
}}
exit={{
opacity: 0,
y: -50,
}}
transition={{
duration: 0.3,
}}
className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-red-600 px-6 py-4 rounded-2xl shadow-2xl font-semibold"
>
Message should not exceed 1000 characters
</motion.div>

)}

</AnimatePresence>



{/* SIDEBAR */}
<div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">

{/* LOGO */}
<div className="p-6 border-b border-slate-800">

<h1 className="text-2xl font-bold tracking-wide">
Email Agent
</h1>

<p className="text-slate-400 text-sm mt-1">
AI Email Automation
</p>

</div>



{/* NEW CHAT */}
<div className="p-4">

<button
onClick={createnewchat}
className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 rounded-2xl py-3 font-semibold shadow-lg"
>
+ New Chat
</button>

</div>



{/* THREADS */}
<div className="flex-1 overflow-y-auto px-3 space-y-3">

{Array.isArray(threads) &&
threads.map((item, index) => (

<div
key={index}
onClick={() =>
loadthread(
item.message,
item.config
)
}
className="bg-slate-800 hover:bg-slate-700 cursor-pointer transition-all rounded-2xl p-4"
>

<p className="font-medium">
{item.config}
</p>

<p className="text-sm text-slate-400 truncate mt-1">
{item.message?.[0]?.message}
</p>

</div>

))}

</div>



{/* PROFILE */}
<div className="p-4 border-t border-slate-800">

<div className="bg-slate-800 rounded-2xl p-4">

<p className="font-semibold">
Saksham Gupta
</p>

<p className="text-sm text-slate-400 mt-1">
AI Email Assistant
</p>

</div>

</div>

</div>



{/* MAIN SECTION */}
<div className="flex-1 flex flex-col">

{/* HEADER */}
<div className="h-16 border-b border-slate-800 bg-slate-900 flex items-center px-6">

<h2 className="text-xl font-semibold">
Conversation
</h2>

</div>



{/* MESSAGES */}
<div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">

{history.map((msg, index) => (

<motion.div
key={index}
initial={{
opacity: 0,
y: 20,
}}
animate={{
opacity: 1,
y: 0,
}}
transition={{
duration: 0.3,
}}
className={`flex items-start gap-3 ${
msg.role === "user"
? "justify-end"
: "justify-start"
}`}
>

{/* AI AVATAR */}
{msg.role === "agent" && (

<div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
AI
</div>

)}

{/* MESSAGE */}
<div
className={`max-w-2xl rounded-2xl p-4 shadow-lg break-words ${
msg.role === "user"
? "bg-blue-600 text-white"
: "bg-slate-800 text-slate-100"
}`}
>

<p
dangerouslySetInnerHTML={{
__html: msg.message,
}}
/>

</div>

</motion.div>

))}

<div ref={chatRef} />

</div>



{/* INPUT AREA */}
<div className="border-t border-slate-800 bg-slate-900 p-4">

<div className="flex items-center gap-3">

<input
type="text"
placeholder="Type your email request..."
className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
value={input}
onChange={(e) =>
setinput(e.target.value)
}
onKeyDown={(e) =>
e.key === "Enter" &&
handlingrequest()
}
/>

<button
className="bg-blue-600 hover:bg-blue-700 transition-all px-6 py-4 rounded-2xl font-semibold shadow-lg"
onClick={handlingrequest}
>
Send
</button>

</div>



{/* CHARACTER COUNTER */}
<div className="flex justify-end mt-2">

<p
className={`text-sm ${
input.length > 900
? "text-red-400"
: "text-slate-400"
}`}
>
{input.length}/1000
</p>

</div>

</div>

</div>

</div>

);

}
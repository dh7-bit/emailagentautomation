import React, { useEffect, useState } from "react";

export default function HumanApprovalPage() {
  const [threads, setThreads] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(selected)
  // ================= FETCH PENDING THREADS =================
  const fetchPending = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/pending-approvals");
      const data = await res.json();
      console.log(data)
      setThreads(data.pending || []);
    } catch (err) {
      console.log("Error fetching approvals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);
  const handlingdecision=async(decision)=>{
    const response=await fetch('http://127.0.0.1:8000/resume',{
        method:'POST',
        headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
decision:decision,
threadid:selected.config
}),
    })
  }
  return (
    <div className="h-screen flex bg-slate-950 text-white">

      {/* LEFT SIDEBAR */}
      <div className="w-1/3 border-r border-slate-800 p-4 overflow-y-auto">

        <h1 className="text-xl font-bold mb-4">
          Pending Approvals
        </h1>

        {loading && (
          <p className="text-slate-400">Loading...</p>
        )}

        {!loading && threads.length === 0 && (
          <p className="text-slate-400">No pending requests</p>
        )}

        {threads.map((t, i) => (
          <div
            key={i}
            onClick={() => setSelected(t)}
            className="bg-slate-800 hover:bg-slate-700 cursor-pointer p-4 rounded-xl mb-3 transition"
          >
            <p className="font-semibold">{t.config}</p>

            <p className="text-sm text-slate-400 truncate">
              {t.message?.[0]?.message ||
                "No message preview"}
            </p>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 p-6">

        {!selected ? (
          <div className="text-slate-400">
            Select a thread to review
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">
              {selected.config}
            </h2>

            {/* MESSAGES */}
            <div className="space-y-3 mb-6">

              {selected.message?.map((m, i) => (
                <div
                  key={i}
                  className={`p-4 rounded-xl ${
                    m.role === "user"
                      ? "bg-blue-600"
                      : "bg-slate-800"
                  }`}
                >
                  <p>{m.message}</p>

                  {selected.confirmation === "Pending" && (
                    <span className="text-yellow-400 text-sm">
                      ⏳ Pending approval
                    </span>
                  )}
                </div>
              ))}

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4">

              <button
                 onClick={()=>handlingdecision('approve')}
                className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-xl font-semibold"
              >
                Approve
              </button>

              <button
     onClick={()=>handlingdecision('reject')}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl font-semibold"
              >
                Reject
              </button>

            </div>
          </>
        )}

      </div>
    </div>
  );
}
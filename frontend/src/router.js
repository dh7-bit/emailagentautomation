import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chatpage from "./second";
import EmailAgentUI from "./firstpage";
import HumanApprovalPage from "./humanapproval";
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* First Page */}
        <Route path="/" element={< Chatpage/>} />
 <Route path="/chat" element={< EmailAgentUI/>} />
 <Route path="/humanapprovalpage" element={<HumanApprovalPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}
# 📧 AI Email Automation System with Human-in-the-Loop Approval Workflows

An enterprise-oriented AI email automation platform that combines Agentic AI, stateful workflow orchestration, and mandatory human oversight to ensure safe and auditable email delivery.

Built using LangGraph, LangChain, SMTP integration, and a real-time approval dashboard, the system enables AI-assisted email drafting while enforcing human approval before any email is sent.

---

## 🚀 Features

### 🤖 AI-Powered Email Composition

Generate context-aware emails from natural language instructions using Large Language Models (LLMs).

### 🔄 LangGraph Stateful Workflows

Uses LangGraph to orchestrate multi-step workflows with conditional state transitions and approval checkpoints.

### 👨‍💼 Human-in-the-Loop Approval

All generated emails require explicit approval before dispatch.

### 🔒 Thread-Level Request Locking

Prevents users from submitting multiple concurrent requests within the same email thread.

### 🧠 Persistent Thread Memory

Maintains conversation history for each email thread to preserve context across multiple interactions.

### ✂️ Controlled Memory Window

Uses a sliding window of the most recent 10 messages to optimize context quality and manage token usage.

### 📬 SMTP Email Delivery

Supports real email dispatch through SMTP after approval.

### 📊 Monitoring Dashboard

Provides visibility into:

* Pending Requests
* Approved Emails
* Rejected Emails
* Workflow Status
* Thread Activity

### 📝 Full Auditability

Every request, approval action, and sent email remains associated with its thread history.

---

# 🏗️ System Architecture

```text
User Input
      │
      ▼
LangGraph Agent
      │
      ▼
Email Composition
      │
      ▼
Approval Queue
      │
      ▼
Human Dashboard Review
      │
 ┌────┴────┐
 │         │
 ▼         ▼
Approve   Reject
 │
 ▼
SMTP Email Dispatch
 │
 ▼
Thread History Update
 │
 ▼
Thread Unlock
```

---

# 🧠 How It Works

1. User submits an email request.
2. LangGraph processes the request.
3. AI drafts the email.
4. Draft is added to the approval queue.
5. Dashboard displays pending requests.
6. Human reviewer approves or rejects.
7. Approved emails are sent via SMTP.
8. Thread history is updated.
9. Thread lock is released for future requests.

---

# 🔒 Concurrency Protection

The system implements thread-level request locking.

### Problem

Without locking:

* Multiple email requests can be submitted simultaneously
* Duplicate send attempts may occur
* Workflow states become inconsistent

### Solution

```text
Thread A
    │
Pending Approval
    │
Thread Locked
    │
No Additional Requests Allowed
    │
Approval / Rejection
    │
Thread Unlocked
```

This prevents race conditions and ensures workflow consistency.

---

# 🧠 Memory Management

Instead of sending entire conversation histories to the LLM:

### Implemented Strategy

* Persistent thread history storage
* Sliding memory window
* Maximum 10 messages retained in active context

Benefits:

* Reduced token consumption
* Faster inference
* Improved response relevance
* Better scalability

---

# 📊 Dashboard Capabilities

The monitoring dashboard provides:

* Pending approval requests
* Approved email history
* Rejected requests
* Thread-level workflow visibility
* Real-time status monitoring

---

# 🛠️ Tech Stack

## Backend

* Python
* Flask / FastAPI

## Agentic AI

* LangGraph
* LangChain
* LLM APIs

## Email Infrastructure

* SMTP

## Workflow Components

* Human Approval Gate
* Thread Locking System
* Persistent Thread Memory
* Stateful Workflow Engine

---

# 📂 Project Workflow

```text
User
 ↓
Natural Language Request
 ↓
LangGraph Workflow
 ↓
AI Email Draft Generation
 ↓
Approval Queue
 ↓
Dashboard Review
 ↓
Approve / Reject
 ↓
SMTP Delivery
 ↓
Thread Update
 ↓
Workflow Complete
```

---

# 🎯 Key Design Decisions

### ❌ Fully Automated Email Sending

Issue:

* Unsafe for production environments
* Risk of incorrect email dispatch

Decision:

* Replaced with mandatory human approval.

---

### ❌ No Request Locking

Issue:

* Duplicate requests
* Race conditions

Decision:

* Implemented thread-level locking.

---

### ❌ Unlimited Memory

Issue:

* Token limit problems
* Increased latency
* Context degradation

Decision:

* Adopted 10-message sliding memory window.

---

### ✅ Final Architecture

* LangGraph Stateful Workflow
* Human Approval Gate
* SMTP Integration
* Persistent Thread History
* Request Locking System
* Monitoring Dashboard

---

# 📈 Project Impact

This project demonstrates how Agentic AI can be safely integrated into real-world business workflows through stateful orchestration and mandatory human oversight.

Key outcomes:

* Safe AI-assisted email automation
* Human-controlled execution layer
* Audit-ready workflow history
* Race-condition prevention
* Production-oriented architecture
* Enterprise-ready agent design patterns

---

# 🔗 GitHub Repository

Repository:

https://github.com/dh7-bit/emailagentautomation

---

# 👨‍💻 Author

Saksham Gupta

Agentic AI | LangGraph | LangChain | RAG | AI Automation | Workflow Engineering

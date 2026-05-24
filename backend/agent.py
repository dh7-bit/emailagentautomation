from langgraph.checkpoint.sqlite import SqliteSaver 
from langchain.agents.middleware import SummarizationMiddleware
from langchain.agents.middleware import HumanInTheLoopMiddleware
from langchain.tools import tool
from langchain.agents import create_agent
from model import models
import smtplib
import os 
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
checkpointer_cm = SqliteSaver.from_conn_string("graph.db") 
checkpointer = checkpointer_cm.__enter__()
@tool
def email(emailaddress: str, details: str):
    """Use only for email drafting/sending"""

    try:
        sender_email = os.getenv("EMAIL_USER")
        app_password = os.getenv("EMAIL_APP_PASSWORD")

        if not sender_email or not app_password:
            return {
                "status": "error",
                "message": "Email credentials not configured"
            }

        # Create email
        msg = MIMEMultipart()
        msg["From"] = sender_email
        msg["To"] = emailaddress
        msg["Subject"] = "AI Generated Email"

        msg.attach(MIMEText(details, "plain"))

        # SMTP connection (Gmail)
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()

        server.login(sender_email, app_password)
        server.send_message(msg)
        server.quit()

        return {
            "status": "success",
            "to": emailaddress,
            "message": details
        }

    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }
 
agentic= create_agent(
    model=models,
    tools=[email],
      checkpointer=checkpointer,
    system_prompt = """
You are an AI assistant that ONLY handles email-related tasks.

RULES:

1. Tool usage:
- You ONLY have access to the email tool.
- You must use the email tool whenever the user request is related to:
  - writing emails
  - sending emails
  - drafting emails
  - formatting emails

2. Strict restriction:
- If the user request is NOT related to email, you MUST NOT respond.
- Do NOT answer.
- Do NOT explain anything.
- Do NOT use tools.
- Just give response i am not able answer.

3. Safety rule:
- Never provide general knowledge or assistance outside email domain.

4. Behavior:
- Be strictly an email automation system, not a general AI assistant.
""",
   middleware=[
       SummarizationMiddleware( model=models, 
                               max_tokens_before_summary=700,
                               messages_to_keep=4, ),
       HumanInTheLoopMiddleware(
           interrupt_on={
               "email":{
                   "allowed_decisions":["approve","reject","edit"]
               }
           }
       )
   ]
)

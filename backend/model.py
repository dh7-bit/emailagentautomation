import os 
from dotenv import load_dotenv 
from langchain_groq import ChatGroq
load_dotenv()
models = ChatGroq(
    model="qwen/qwen3-32b",
    api_key=os.getenv("GROQ"),
)
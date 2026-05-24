from pymongo import MongoClient
from dotenv import load_dotenv
import os

# load .env file
load_dotenv()

# mongodb url from env
MONGO_URL = os.getenv("MONGO")

# connect mongodb
client = MongoClient(MONGO_URL)

# database
db = client["email_agent"]

chat_collection = db["chat_history"]
verifyinginteruption=db['checkinghumanloop']
print("MongoDB Connected Successfully")
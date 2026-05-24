from db import chat_collection

chat_collection.update_one(
    {"thread": "112hacking"},   # FILTER
    {
        "$push": {
            "messages": {
                "role": "user",
                "message": "new msg"
            }
        }
    }
)
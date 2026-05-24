from fastapi import FastAPI,Request
from langgraph.types import Command
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from db import verifyinginteruption
from db import chat_collection
from agent import agentic
app = FastAPI()

# ✅ CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Movie(BaseModel):
    text: str = Field(description="this is text given by user")
    threadids:str=Field(description='this is user personal chat history')

@app.post("/sentdataagent")
async def good(req: Movie):
    # id=request.json('threadids')

    inputtext = req.text
    threadid=req.threadids 
    config={
        "configurable":{"thread_id":threadid}
    }
    response=verifyinginteruption.find_one({"config": threadid})
    if(response):
        if response['confirmation']=='Pending':
            return{
                "reply":"your previous request is pending by admin"
            }
    if(response):
        if response['count']>10:
            return{
            "reply":"your thread message quota finished"
        }
    agentresponse=agentic.invoke({"messages":inputtext},config=config)
    reply = agentresponse["messages"][-1].content
    if(response):
        count=response['count']
        verifyinginteruption.update_one(
{"config": threadid},
{
"$set": {
"count": count + 1,
"confirmation":"Pending"
}
}
)
        chat_collection.update_one({"config":threadid},{"$push":{
            "message":{
                "role":"user",
                "message":inputtext
            }
        }})
        return {
            'reply':reply
        }
    else:
         verifyinginteruption.insert_one({"count":0,"config":threadid,"confirmation":"Pending"})
         chat_collection.insert_one({"config":threadid,"message":[{"role":"user","message":inputtext}]})
    return {
        "reply":reply
    }


@app.get("/allthreads")
def allthreads():
    data = list(
    chat_collection.find(
        {},
        {
            "_id": 0
        }
    ))
    return {
    "threads": data
}

@app.get("/pending-approvals")
def get_pending_approvals():
    data = list(
        verifyinginteruption.find(
            {"confirmation": "Pending"},
            {"_id": 0}
        )
    )

    return {
        "count": len(data),
        "pending": data
    }


@app.post('/resume')
async def resume(req:Request):
    body = await req.json()
    decision = body.get("decision")
    thread=body.get('threadid')
    config={
    "configurable":{"thread_id":thread},
}
    if(decision=='approve'):
        results=agentic.invoke(
        Command(
            resume={
                "decisions":[
                    {"type":"approve",
                    
                     }
                ]
            }
        ),
        config=config
    )
        verifyinginteruption.update_one(
         {"config": thread},
          {
            "$set": {
             "confirmation":"approved"
             }
             }
            )
        chat_collection.update_one(
        {"config": thread},
        {
            "$push": {
                "message": {
                    "role": "assistant",
                    "message": results['messages'][-1].content
                }
            }
        },
        upsert=True
    )
    else:
        results = agentic.invoke(
            Command(
                resume={
                    "decisions": [
                        {
                            "type": "reject",
                        }
                    ]
                }
            ),
            config=config
        )
        verifyinginteruption.update_one(
            {"config": thread},
            {
                "$set": {
                    "confirmation": "reject"
                }
            }
        )
        chat_collection.update_one(
        {"config": thread},
        {
            "$push": {
                "message": {
                    "role": "assistant",
                    "message": results['messages'][-1].content
                }
            }
        },
        upsert=True
    )



    
    return{
        "reply":results['messages'][-1].content
    }




    
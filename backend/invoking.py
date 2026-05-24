from agent import agentic
config={
    "configurable":{"thread_id": "notgood"},
}
# config={"configurable":{"thread_id":"test-checkingeditones"}}
results=agentic.invoke({"messages":"send this message helo are you great to sakshamgupta0155@gmail.com"},config=config)

from langgraph.types import Command
from agent import agentic
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
print(results['messages'][-1].content)
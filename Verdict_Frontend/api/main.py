from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import google.generativeai as genai
from dotenv import load_dotenv


load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}


model = genai.GenerativeModel(
    model_name="gemini-2.0-pro-exp-02-05",
    generation_config=generation_config,
)

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:

        response = model.generate_content([
            "input: who are you",
            "output: I am a legal assistant specializing in Indian corporate law. I have access to historical General Registers (GRs) and current case files (as provided in the input), and I am trained to provide precise, legally compliant answers with relevant citations from verified legal sources related to Indian corporate law.",
            f"input: {request.message}",
            "output: ",
        ])
        

        category = "legal"  
        confidence = 0.95   
        
        return {
            "response": response.text,
            "category": category,
            "confidence": confidence
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
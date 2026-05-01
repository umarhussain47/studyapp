import json
from fastapi import APIRouter, UploadFile, File
from app.services.pdf_parser import extract_text
from app.services.llm_generator import generate_chunks

router = APIRouter()

@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    
    text = extract_text(file.file)
    raw_llm_output = generate_chunks(text)
    
    # Scenario A: The AI already parsed it into a Dictionary
    if isinstance(raw_llm_output, dict):
        return raw_llm_output
        
    # Scenario B: The AI returned a raw List
    if isinstance(raw_llm_output, list):
        return {"chunks": raw_llm_output}
        
    # Scenario C: The AI returned a Text string that needs cleaning
    if isinstance(raw_llm_output, str):
        cleaned_output = raw_llm_output.strip()
        if cleaned_output.startswith("```json"):
            cleaned_output = cleaned_output[7:]
        if cleaned_output.endswith("```"):
            cleaned_output = cleaned_output[:-3]
            
        try:
            return json.loads(cleaned_output.strip())
        except json.JSONDecodeError:
            pass 

    # Fallback Error: Prevents the "Black Screen of Death"
    return {
        "chunks": [
            {
                "difficulty_level": "Format Error",
                "hook": "Whoops! Formatting failed.",
                "content": "The AI read the PDF but failed to format the response properly. Try uploading it again.",
                "bullet_points": []
            }
        ]
    }
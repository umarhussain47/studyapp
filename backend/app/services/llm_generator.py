from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize the Groq client
# Ensure GROQ_API_KEY is set in your Render environment variables or .env file
client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)

def generate_chunks(text):
    """
    Converts input text into a dynamic number of JSON learning chunks 
    based on the source word count.
    """
    # Calculate target chunks based on text density (~1 chunk per 150 words)
    word_count = len(text.split())
    target_chunks = max(5, min(30, word_count // 150))

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            # This requires the word "json" in the system prompt to avoid 400 errors
            response_format={"type": "json_object"}, 
            messages=[
                {
                    "role": "system",
                    "content": f"""You are a mobile learning designer. 
                    Your goal is to output a valid JSON object containing an array of learning slides.
                    
                    Convert the provided text into exactly {target_chunks} bite-sized learning slides.
                    
                    RULES:
                    1. 'difficulty_level': Short label (e.g., 'The Basics').
                    2. 'hook': Max 6 words. DO NOT use asterisks or markdown.
                    3. 'content': Max 2 short sentences. No markdown.
                    4. 'bullet_points': Max 3 points. Each point max 7 words.
                    5. STRICT: Never use markdown symbols like **bold** or __italics__ in any field.
                    6. The output must be a JSON object with a key named 'chunks'."""
                },
                {
                    "role": "user",
                    "content": text
                }
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        # Logging the error for debugging in Render logs
        print(f"LLM Generation Error: {e}")
        raise e
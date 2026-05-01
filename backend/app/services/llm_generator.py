from openai import OpenAI
import os
from dotenv import load_dotenv

# Force load the .env file BEFORE the client is created
load_dotenv()

client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)
# Ensure your Groq API key is in your environment variables
client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)

from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.environ.get("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1",
)

def generate_chunks(text):
    # Determine a target number of chunks based on word count (~1 chunk per 150 words)
    word_count = len(text.split())
    target_chunks = max(5, min(30, word_count // 150))

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        response_format={"type": "json_object"}, 
        messages=[
            {
                "role": "system",
                "content": f"""You are a mobile learning designer. 
                Convert the text into exactly {target_chunks} bite-sized learning slides.
                RULES:
                1. 'difficulty_level': Short label (e.g., 'The Basics').
                2. 'hook': Max 6 words. DO NOT use asterisks or markdown.
                3. 'content': Max 2 short sentences. No markdown.
                4. 'bullet_points': Max 3 points. Each point max 7 words.
                5. STRICT: Never use **bold** or __italics__ in any field."""
            },
            {
                "role": "user",
                "content": text
            }
        ]
    )
    return response.choices[0].message.content
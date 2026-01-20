import os
import google.generativeai as genai
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / '.env')
genai.configure(api_key=os.getenv('VITE_GEMINI_API_KEY'))

print("Available models:")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(f" - {m.name}")

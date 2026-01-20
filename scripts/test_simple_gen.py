import os
import google.generativeai as genai
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / '.env')
genai.configure(api_key=os.getenv('VITE_GEMINI_API_KEY'))

model = genai.GenerativeModel("gemini-2.0-flash")
print("Generating...")
try:
    response = model.generate_content("Say hello")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")

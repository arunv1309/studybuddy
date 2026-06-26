from flask import Flask, render_template, request, jsonify
from groq import Groq
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Create Flask app
app = Flask(__name__)

# Get API key from .env
api_key = os.getenv("GROQ_API_KEY")

# Initialize Groq client
client = Groq(
    api_key=api_key
)


# Home Page
@app.route('/')
def home():
    return render_template('index.html')


# Ask AI Route
@app.route('/ask', methods=['POST'])
def ask():

    try:

        data = request.get_json()

        prompt = data['prompt']

        print("User Prompt:", prompt)


        chat = client.chat.completions.create(

            model="llama-3.3-70b-versatile",

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]

        )


        answer = chat.choices[0].message.content


        print("Groq Response:", answer)


        return jsonify({

            "answer": answer

        })


    except Exception as e:


        print("ERROR:", str(e))


        return jsonify({

            "answer": str(e)

        })


# Run Flask
if __name__ == "__main__":
    app.run(debug=True)
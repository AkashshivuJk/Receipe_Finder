from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# Define the API key and endpoint
API_KEY = 'YOUR_GEMINI_API'
API_URL = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={API_KEY}'

@app.route('/')
def index():
    return render_template('index.html')  

@app.route('/chat', methods=['POST'])
def chat():
    # Get user input from the request JSON
    data = request.get_json()
    query = data.get('message')

    # Validate input
    if not query:
        return jsonify({"response": "Please enter a valid input."})

    # Prepare the request body for Gemini API
    request_body = {
        "contents": [
            {
                "parts": [
                    {
                        "text": f"Suggest a few recipes using the following ingredients: {query}"
                    }
                ]
            }
        ]
    }

    # Send request to Gemini API
    try:
        response = requests.post(API_URL, json=request_body)
        response_data = response.json()

        # Log the raw API response for debugging
        # print("Raw API Response:", response_data)

        # Extract the response content
        recipe_suggestions = response_data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', 'No suggestions available.')

        # Return response
        return jsonify({"response": recipe_suggestions})
    except Exception as e:
        return jsonify({"response": "Failed to fetch recipes. Please try again later."})

if __name__ == '__main__':
    app.run(debug=True)

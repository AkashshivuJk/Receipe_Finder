const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Updated API Key
const API_KEY = "AIzaSyAPEZdIHoEqZxp-Ihwlari_yfs7iCF0cQk";

// Function to fetch recipes from the Gemini API
async function fetchRecipes(ingredients, name = "User", preferences = "None", time = "30 mins") {
    try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:predict?key=${API_KEY}`;

        const requestBody = {
            instances: [
                {
                    content: `User Name: ${name}\nIngredient List: ${ingredients}\nDietary Preferences: ${preferences}\nCooking Time Available: ${time}\n
                    Based on the provided ingredients, suggest a recipe that can be made within the given time frame. 
                    Take into account dietary preferences while creating the recipe. Provide step-by-step instructions for the dish.
                    Suggest ingredient substitutions if any key ingredient is missing and include tips for enhancing the flavor or presentation of the dish.
                    Additionally, recommend a complementary drink or side dish to pair with the recipe.`,
                },
            ],
            parameters: {
                temperature: 0.7,
                maxOutputTokens: 512,
            },
        };

        // Log request for debugging
        console.log("Request Body:", JSON.stringify(requestBody, null, 2));

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            console.error(`API request failed with status ${response.status} - ${response.statusText}`);
            throw new Error("Failed to fetch recipes from the API.");
        }

        const data = await response.json();
        console.log("Response Data:", JSON.stringify(data, null, 2));

        // Check and parse the recipe response
        const recipeResponse = data?.predictions?.[0]?.content || "No recipes found. Please try again.";
        return recipeResponse;
    } catch (error) {
        console.error("Error fetching recipes:", error);
        return "There was an error fetching recipes. Please try again later.";
    }
}

// Function to add a message to the chatbox
function addMessage(content, isBot = true) {
    const message = document.createElement("div");
    message.className = isBot ? "bot-message" : "user-message";
    message.innerHTML = content;
    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Event listener for the send button
sendBtn.addEventListener("click", async () => {
    const ingredients = userInput.value.trim();
    if (ingredients) {
        addMessage(ingredients, false); // Add user's input
        userInput.value = ""; // Clear input field
        addMessage("Let me find recipes for you..."); // Add bot's typing message

        const recipeResponse = await fetchRecipes(ingredients);
        addMessage(recipeResponse); // Add the response from the API
    }
});

// Allow pressing "Enter" to trigger the send button
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendBtn.click();
    }
});

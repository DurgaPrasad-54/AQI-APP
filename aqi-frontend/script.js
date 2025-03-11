document.getElementById("aqiForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Collect and parse input values
    const pm25 = parseFloat(document.getElementById("pm25").value.trim());
    const pm10 = parseFloat(document.getElementById("pm10").value.trim());
    const no2 = parseFloat(document.getElementById("no2").value.trim());
    const so2 = parseFloat(document.getElementById("so2").value.trim());
    const o3 = parseFloat(document.getElementById("o3").value.trim());

    // Validate inputs
    if ([pm25, pm10, no2, so2, o3].some(isNaN)) {
        showResult("Please ensure all fields are filled with valid numbers.", "red");
        return;
    }

    try {
        // Display loading feedback
        showResult("Predicting AQI... Please wait.", "blue");

        // Fetch prediction from API
        const response = await fetch("https://aqi-app-2-1wi7.onrender.com/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "PM2.5": pm25, "PM10": pm10, "NO2": no2, "SO2": so2, "O3": o3 })
        });

        // Handle response
        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const data = await response.json();

        // Display results
        showResult(
            `Predicted AQI: <strong>${data.Predicted_AQI}</strong><br>
            AQI Category: <span style="font-weight: bold; color: ${getAQIColor(data.AQI_Category)};">
                ${data.AQI_Category}
            </span>`, 
            "black"
        );

    } catch (error) {
        console.error("Error:", error);
        showResult("An error occurred while predicting AQI. Please try again later.", "red");
    }
});

// Function to display results dynamically
function showResult(message, color) {
    document.getElementById("result").innerHTML = `<p style="color: ${color};">${message}</p>`;
}

// Function to dynamically assign a color based on AQI category
function getAQIColor(category) {
    const colors = {
        "Good": "green",
        "Satisfactory": "yellow",
        "Moderate": "orange",
        "Poor": "red",
        "Very Poor": "darkred",
        "Severe": "purple"
    };
    return colors[category] || "black"; // Default color if category is unknown
}

document.getElementById("aqiForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Collect and parse input values
    const pm25 = parseFloat(document.getElementById("pm25").value);
    const pm10 = parseFloat(document.getElementById("pm10").value);
    const no2 = parseFloat(document.getElementById("no2").value);
    const so2 = parseFloat(document.getElementById("so2").value);
    const o3 = parseFloat(document.getElementById("o3").value);

    // Validate inputs
    if (isNaN(pm25) || isNaN(pm10) || isNaN(no2) || isNaN(so2) || isNaN(o3)) {
        document.getElementById("result").innerHTML = `
            <p style="color: red;">Please ensure all fields are filled with valid numbers.</p>
        `;
        return;
    }

    try {
        // Display loading feedback
        document.getElementById("result").innerHTML = `<p>Predicting AQI... Please wait.</p>`;

        // Fetch prediction from API
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "PM2.5": pm25,
                "PM10": pm10,
                "NO2": no2,
                "SO2": so2,
                "O3": o3
            })
        });

        // Handle response
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        // Display results
        document.getElementById("result").innerHTML = `
            <p>Predicted AQI: <strong>${data.Predicted_AQI}</strong></p>
            <p>AQI Category: <span style="font-weight: bold; color: ${getAQIColor(data.AQI_Category)};">
                ${data.AQI_Category}
            </span></p>
        `;
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("result").innerHTML = `
            <p style="color: red;">An error occurred while predicting AQI. Please try again later.</p>
        `;
    }
});

// Function to dynamically assign a color based on AQI category
function getAQIColor(category) {
    const colors = {
        Good: "green",
        Moderate: "orange",
        "Unhealthy for Sensitive Groups": "red",
        Unhealthy: "darkred",
        Hazardous: "purple"
    };
    return colors[category] || "black"; // Default color if category is unknown
}

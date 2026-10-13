
const API_URL = "https://hundredth-chef-backer.ngrok-free.dev";

const newsText = document.getElementById("newsText");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const analyzeButton = document.getElementById("analyzeButton");

const predictionTitle = document.getElementById("predictionTitle");
const predictionDescription = document.getElementById("predictionDescription");
const nonFakeScore = document.getElementById("nonFakeScore");
const nonFakeBar = document.getElementById("nonFakeBar");
const fakeScore = document.getElementById("fakeScore");
const fakeBar = document.getElementById("fakeBar");
const message = document.getElementById("message");

// Image preview
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];

    if (!file) {
        imagePreview.removeAttribute("src");
        imagePreview.style.display = "none";
        message.textContent = "";
        return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        message.textContent = "Please upload a JPG, PNG, or WebP image.";
        imageInput.value = "";
        imagePreview.removeAttribute("src");
        imagePreview.style.display = "none";
        return;
    }

    if (imagePreview.dataset.previewUrl) {
        URL.revokeObjectURL(imagePreview.dataset.previewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    imagePreview.dataset.previewUrl = previewUrl;
    imagePreview.src = previewUrl;
    imagePreview.style.display = "block";
    message.textContent = "";
});

// Analyze news using the Colab API
analyzeButton.addEventListener("click", async () => {
    const text = newsText.value.trim();
    const image = imageInput.files[0];

    if (!text) {
        message.textContent = "Please enter the news text.";
        newsText.focus();
        return;
    }

    if (!image) {
        message.textContent = "Please upload a news image.";
        imageInput.focus();
        return;
    }

    const formData = new FormData();
    formData.append("news_text", text);
    formData.append("image", image);

    analyzeButton.disabled = true;
    analyzeButton.textContent = "Analyzing...";
    message.textContent = "Connecting to TruthLens AI...";

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: "POST",
            headers: {
                "ngrok-skip-browser-warning": "true"
            },
            body: formData
        });

        const contentType = response.headers.get("content-type") || "";

        if (!contentType.includes("application/json")) {
            throw new Error(
                "API did not return JSON. Open the API /docs link and check that Colab is running."
            );
        }

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.detail || result.error || `Server error: ${response.status}`
            );
        }

        if (result.error) {
            throw new Error(result.error);
        }

        if (
            !result.prediction ||
            typeof result.non_fake_score !== "number" ||
            typeof result.fake_score !== "number"
        ) {
            throw new Error("Unexpected API response. Please check the backend.");
        }

        predictionTitle.textContent =
            result.prediction === "Fake"
                ? "Prediction: Fake"
                : "Prediction: Non-Fake";

        predictionDescription.textContent =
            "Experimental AI prediction based on text and image features.";

        nonFakeScore.textContent = `${result.non_fake_score}%`;
        nonFakeBar.style.width =
            `${Math.max(0, Math.min(100, result.non_fake_score))}%`;

        fakeScore.textContent = `${result.fake_score}%`;
        fakeBar.style.width =
            `${Math.max(0, Math.min(100, result.fake_score))}%`;

        message.textContent =
            result.disclaimer ||
            "Prediction complete. Verify the news with reliable sources.";

    } catch (error) {
        console.error("TruthLens API error:", error);

        if (error instanceof TypeError) {
            message.textContent =
                "Connection failed. Check the Colab server, ngrok URL, and browser console for CORS errors.";
        } else {
            message.textContent = error.message;
        }
    } finally {
        analyzeButton.disabled = false;
        analyzeButton.textContent = "Analyze News";
    }
});

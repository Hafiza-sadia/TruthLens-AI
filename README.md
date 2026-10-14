# TruthLens AI

AI-powered fake news detection prototype using **DistilBERT**, **ResNet18**, and a **multimodal fusion model**. The project has a frontend built with HTML, CSS, and JavaScript, while model training and inference currently run in Google Colab.

> **Disclaimer:** TruthLens AI is an experimental prediction tool, not an independent fact-checking service. Predictions can be wrong, including for genuine news.

## Project Structure

```text
TruthLens-AI/
├── index.html                  # Web interface
├── style.css                   # Frontend styling
├── script.js                   # UI behavior and API requests
├── TruthLens_AI_Backend.ipynb  # Colab training/inference notebook
└── README.md                   # Project documentation
```

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Text model:** DistilBERT
- **Image model:** ResNet18
- **Multimodal model:** Fusion classifier
- **Backend API:** FastAPI
- **Training/inference environment:** Google Colab (GPU when available)
- **Tunneling during development:** ngrok

## How It Works

1. Open the web interface.
2. Enter a news headline or text.
3. Upload an image if the current API requires one.
4. Select **Analyze**.
5. The frontend sends the text and image to the FastAPI `/predict` endpoint.
6. The API returns a predicted label and model confidence scores, which the page displays.

The current backend endpoint expects both `news_text` and `image`. Text-only input is **not supported by the current API unless a trained text-classification path is added**.

## Run the Frontend Locally

### 1. Download or clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/TruthLens-AI.git
cd TruthLens-AI
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Open the frontend

Open the folder in Visual Studio Code and run `index.html` using the **Live Server** extension. Alternatively, open `index.html` in a browser, although Live Server is recommended.

The local development URL may look like:

```text
http://127.0.0.1:5500/index.html
```

The frontend alone does not perform model inference; the backend API must also be running and reachable.

## Run the Backend in Google Colab

The trained weights and dataset are stored in Google Drive, not in this GitHub repository.

### 1. Open the notebook

Open `TruthLens_AI_Backend.ipynb` in Google Colab.

### 2. Connect Google Drive

Run the notebook cell that mounts Drive and authorize access when prompted. The model paths currently used by the project are:

```text
/content/drive/MyDrive/AI_Fake_News_Project/models/distilbert_best/
/content/drive/MyDrive/AI_Fake_News_Project/models/resnet18_best.pth
/content/drive/MyDrive/AI_Fake_News_Project/models/multimodal_fusion_best.pth
```

Make sure these files and folders exist in your own Google Drive. If you saved them elsewhere, update the paths in the notebook.

### 3. Run the setup and model-loading cells

Run the notebook cells in order to install/import dependencies, set the device, load the tokenizer and models, define `predict_news`, and create the FastAPI app. Select a GPU runtime if available and needed.

### 4. Start the API and tunnel

Run the notebook cells that start Uvicorn and ngrok. Use the **current public ngrok URL** in `script.js` as the API base URL. A free ngrok URL may change when the tunnel is restarted.

Do not publish ngrok authentication tokens, API keys, or other secrets in the notebook or repository.

### 5. Test the API

Open the base API URL in a browser. The root endpoint should return a message indicating the API is running. Then test a prediction through the frontend with news text and a supported image format (JPG, PNG, or WebP).

## Important Notes

- **Colab is not a permanent server.** The API becomes unavailable when the runtime disconnects or the server/tunnel stops. Start the required notebook cells again to bring it back online.
- **Model files are not in GitHub.** Keep backups in Google Drive. Do not upload large model weights or datasets to this repository.
- **Keep secrets private.** Never commit ngrok tokens, passwords, API keys, or private credentials.
- **Predictions are not guaranteed to be correct.** The model may misclassify genuine or misleading content.
- **Image input:** The current `/predict` endpoint expects an image. An optional-image mode requires a corresponding backend change and a trained text-only classifier.
- **Deployment:** A stable public demo needs a hosted backend and secure configuration; a Colab/ngrok tunnel is for development and testing.

## Model Artifacts and Dataset

The notebook uses model files stored in Google Drive:

- `distilbert_best/` — saved DistilBERT weights and tokenizer files
- `resnet18_best.pth` — saved ResNet18 weights
- `multimodal_fusion_best.pth` — saved fusion classifier weights
- `dataset/fakeddit_clean.csv` — cleaned dataset

These artifacts are intentionally excluded from this GitHub repository.

## Future Improvements

- Add an explicitly trained text-only classification path so image upload can be optional.
- Evaluate on a separate set of verified real and fake news examples.
- Add stronger error handling, API configuration, and stable backend hosting.
- Document evaluation metrics and known model limitations.

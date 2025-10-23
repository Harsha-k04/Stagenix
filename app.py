# app.py
from flask import Flask, request, jsonify, send_from_directory
from ultralytics import YOLO
from werkzeug.utils import secure_filename
import os
import random
from flask_cors import CORS
import tempfile

# Flask app setup
app = Flask(
    __name__,
    static_folder="backend/public",
    static_url_path=""
)
CORS(app)

# Load YOLOv8 segmentation model
model = YOLO("yolov8l-seg.pt")

# Use temporary folder for uploads (Vercel serverless compatible)
UPLOAD_FOLDER = tempfile.gettempdir()
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/predict", methods=["POST"])
def predict():
    """
    Handles:
    - Image uploads → runs YOLO segmentation
    - Prompt text → returns dummy object layout for AR/3D preview
    """
    response = {}

    if "image" in request.files:
        img = request.files["image"]
        img_path = os.path.join(UPLOAD_FOLDER, secure_filename(img.filename))
        img.save(img_path)

        results = model(img_path)
        result_data = results[0].to_json()

        segmented_path = os.path.join(UPLOAD_FOLDER, "segmented_" + secure_filename(img.filename))
        results[0].save(segmented_path)

        response = {
            "status": "ok",
            "source": "image",
            "results": result_data,
            "segmented_image": f"/uploads/segmented_{secure_filename(img.filename)}"
        }

    elif "prompt" in request.form:
        prompt = request.form["prompt"]
        objects = [
            {"name": "pottedplant", "position": [random.uniform(-1, 1), 0, random.uniform(-1, 1)], "rotation": [0, 0, 0]},
            {"name": "vase", "position": [random.uniform(-1, 1), 0, random.uniform(-1, 1)], "rotation": [0, 0, 0]}
        ]
        response = {
            "status": "ok",
            "source": "prompt",
            "prompt": prompt,
            "objects": objects
        }

    else:
        return jsonify({"error": "No image or prompt provided"}), 400

    print("Response:", response)
    return jsonify(response)

# Serve uploads (temporary folder)
@app.route("/uploads/<path:filename>")
def uploads(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# Serve static assets
@app.route("/assets/<path:filename>")
def assets(filename):
    return send_from_directory("backend/public/assets", filename)

# Serve home page
@app.route("/")
def home():
    return app.send_static_file("ar_stage.html")

# No need for host/port for Vercel
# app.run(host="0.0.0.0", port=5000)  # Remove this

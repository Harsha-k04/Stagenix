from flask import Flask, request, jsonify
from ultralytics import YOLO
import os

app = Flask(__name__)
model = YOLO("yolov8l-seg.pt")  # load your uploaded model

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400

    img = request.files['image']
    img_path = os.path.join("uploads", img.filename)
    img.save(img_path)

    results = model(img_path)
    data = results[0].tojson()

    return jsonify({'results': data})

if __name__ == '__main__':
    os.makedirs("uploads", exist_ok=True)
    app.run(host='0.0.0.0', port=5000)

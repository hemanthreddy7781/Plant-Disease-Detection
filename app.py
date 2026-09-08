from flask import Flask, render_template, request, jsonify
import tensorflow as tf
import numpy as np
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS

app = Flask(__name__)

# Enable CORS
CORS(app)

# Upload configuration
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Allowed image extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Class names
class_names = [
    'Apple___Apple_scab',
    'Apple___Black_rot',
    'Apple___Cedar_apple_rust',
    'Apple___healthy',
    'Blueberry___healthy',
    'Cherry_(including_sour)___Powdery_mildew',
    'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
    'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy',
    'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)',
    'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)',
    'Peach___Bacterial_spot',
    'Peach___healthy',
    'Pepper,_bell___Bacterial_spot',
    'Pepper,_bell___healthy',
    'Potato___Early_blight',
    'Potato___Late_blight',
    'Potato___healthy',
    'Raspberry___healthy',
    'Soybean___healthy',
    'Squash___Powdery_mildew',
    'Strawberry___Leaf_scorch',
    'Strawberry___healthy',
    'Tomato___Bacterial_spot',
    'Tomato___Early_blight',
    'Tomato___Late_blight',
    'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot',
    'Tomato___Spider_mites Two-spotted_spider_mite',
    'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
    'Tomato___Tomato_mosaic_virus',
    'Tomato___healthy'
]

# Load model only once when application starts
MODEL_PATH = "trained_plant_disease_model.keras"
model = tf.keras.models.load_model(MODEL_PATH)


def allowed_file(filename):
    return (
        '.' in filename
        and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
    )


def model_prediction(image_path):
    image = tf.keras.preprocessing.image.load_img(
        image_path,
        target_size=(128, 128)
    )

    input_arr = tf.keras.preprocessing.image.img_to_array(image)
    input_arr = np.array([input_arr])

    predictions = model.predict(input_arr, verbose=0)

    return np.argmax(predictions)


@app.route('/')
def index():
    return render_template('recognition.html')


@app.route('/predict', methods=['POST'])
def predict():

    if 'file' not in request.files:
        return jsonify({
            'error': 'No file part'
        })

    file = request.files['file']

    if file.filename == '':
        return jsonify({
            'error': 'No selected file'
        })

    if file and allowed_file(file.filename):

        filename = secure_filename(file.filename)

        filepath = os.path.join(
            app.config['UPLOAD_FOLDER'],
            filename
        )

        file.save(filepath)

        try:
            result_index = model_prediction(filepath)

            prediction = class_names[result_index]

            return jsonify({
                'success': True,
                'prediction': prediction,
                'image_path': request.host_url +
                              f'static/uploads/{filename}'
            })

        except Exception as e:

            return jsonify({
                'error': str(e)
            })

    return jsonify({
        'error': 'Invalid file type'
    })


if __name__ == '__main__':

    port = int(os.environ.get('PORT', 5000))

    app.run(
        host='0.0.0.0',
        port=port,
        debug=False
    )
import socket
import threading
import json
import cv2
import numpy as np
import tensorflow as tf

# TCP Server Configuration
HOST = '127.0.0.1'  # Standard loopback interface address (localhost)
PORT = 65432        # Port to listen on (non-privileged ports are > 1023)

# Load the TFLite model and labels
TFLITE_MODEL_PATH = "ClashAI_model_lite/detect.tflite"
LABEL_PATH = "ClashAI_model_lite/labelmap.txt"

def load_labels(label_path):
    with open(label_path, 'r') as f:
        return [line.strip() for line in f.readlines()]

labels = load_labels(LABEL_PATH)
interpreter = tf.lite.Interpreter(model_path=TFLITE_MODEL_PATH)
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()
height = input_details[0]['shape'][1]
width = input_details[0]['shape'][2]
float_input = (input_details[0]['dtype'] == np.float32)
input_mean = 127.5
input_std = 127.5

def process_image(image_path):
    image = cv2.imread(image_path)
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    imH, imW, _ = image.shape
    image_resized = cv2.resize(image_rgb, (width, height))
    input_data = np.expand_dims(image_resized, axis=0)

    if float_input:
        input_data = (np.float32(input_data) - input_mean) / input_std

    interpreter.set_tensor(input_details[0]['index'], input_data)
    interpreter.invoke()

    boxes = interpreter.get_tensor(output_details[1]['index'])[0]
    classes = interpreter.get_tensor(output_details[3]['index'])[0]
    scores = interpreter.get_tensor(output_details[0]['index'])[0]

    detections = []
    for i in range(len(scores)):
        if (scores[i] > 0.55) and (scores[i] <= 1.0):
            ymin = int(max(1, (boxes[i][0] * imH)))
            xmin = int(max(1, (boxes[i][1] * imW)))
            ymax = int(min(imH, (boxes[i][2] * imH)))
            xmax = int(min(imW, (boxes[i][3] * imW)))
            object_name = labels[int(classes[i])]
            label = f'{object_name}: {int(scores[i]*100)}%'
            detections.append({"label": label, "coordinates": [xmin, ymin, xmax, ymax]})
    return detections

def handle_client_connection(client_socket):
    try:
        while True:  # Keep the connection open to handle multiple requests
            image_path = client_socket.recv(1024).decode('utf-8').strip()
            if not image_path:  # If an empty string is received, break the loop
                print("No data received. Closing connection.")
                break
            if image_path == "exit":  # Implement an exit command to close the connection
                print("Exit command received. Closing connection.")
                break
            print(f"Received image path: {image_path}")

            results = process_image(image_path)
            response = json.dumps(results).encode('utf-8')
            client_socket.sendall(response)
    except Exception as e:
        print(f"Error processing image: {e}")
    finally:
        print("Closing connection.")
        client_socket.close()

def start_server():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_socket:
        server_socket.bind((HOST, PORT))
        server_socket.listen()
        print(f"Server listening on {HOST}:{PORT}")

        while True:
            client_socket, _ = server_socket.accept()
            print("Accepted connection")
            client_handler = threading.Thread(target=handle_client_connection, args=(client_socket,))
            client_handler.start()

if __name__ == "__main__":
    start_server()

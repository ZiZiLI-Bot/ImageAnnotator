import onnxruntime as ort
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import os
import sys

labels = ['Cap1', 'Cap2', 'Cap3', 'Cap4', 'MOSFET',
          'Mov', 'Resestor', 'Resistor', 'Transformer']


pathImage = sys.argv[1]
absolutePath = sys.argv[3]


def parse_row(row):
    xc, yc, w, h = row[:4]
    x1 = (xc-w/2)/640*img_width
    y1 = (yc-h/2)/640*img_height
    x2 = (xc+w/2)/640*img_width
    y2 = (yc+h/2)/640*img_height
    prob = row[5:].max()
    class_id = row[5:].argmax()
    return [x1, y1, x2, y2, class_id, prob]


def intersection(box1, box2):
    box1_x1, box1_y1, box1_x2, box1_y2 = box1[:4]
    box2_x1, box2_y1, box2_x2, box2_y2 = box2[:4]
    x1 = max(box1_x1, box2_x1)
    y1 = max(box1_y1, box2_y1)
    x2 = min(box1_x2, box2_x2)
    y2 = min(box1_y2, box2_y2)
    return (x2-x1)*(y2-y1)


def union(box1, box2):
    box1_x1, box1_y1, box1_x2, box1_y2 = box1[:4]
    box2_x1, box2_y1, box2_x2, box2_y2 = box2[:4]
    box1_area = (box1_x2-box1_x1)*(box1_y2-box1_y1)
    box2_area = (box2_x2-box2_x1)*(box2_y2-box2_y1)
    return box1_area + box2_area - intersection(box1, box2)


def iou(box1, box2):
    return intersection(box1, box2)/union(box1, box2)


model = ort.InferenceSession(os.path.join(
    absolutePath, 'assets/models/YOLOv5_best.onnx'), providers=['CPUExecutionProvider'])
inputs = model.get_inputs()
input = inputs[0]

img = Image.open(os.path.join(absolutePath, f'../public/uploads/{pathImage}'))
img_width, img_height = img.size
img = img.resize((640, 640))
img = img.convert("RGB")
input = np.array(img)
input = input.transpose(2, 0, 1)
input = input.reshape(1, 3, 640, 640)
input = input/255.0
input = input.astype(np.float32)

outputs = model.get_outputs()
output = outputs[0]

outputs = model.run(["output0"], {"images": input})
output = outputs[0]
output = output[0]
# output = output.transpose()
row = output[0]

x1, y1, x2, y2, class_id, prob = parse_row(row)
boxes = [row for row in [parse_row(row) for row in output] if row[5] > 0.95]


boxes.sort(key=lambda x: x[5], reverse=True)
results = []
while len(boxes) > 0:
    results.append(boxes[0])
    boxes = [box for box in boxes if iou(box, boxes[0]) < 0.1]


img = Image.open(os.path.join(absolutePath, f'../public/uploads/{pathImage}'))
draw = ImageDraw.Draw(img)
font = ImageFont.truetype(os.path.join(
    absolutePath, f"assets/fonts/Gidole-Regular.ttf"), size=18)
for result in results:
    x1, y1, x2, y2, class_id, prob = result
    draw.rectangle((x1, y1, x2, y2), None, "#f90101", width=2)
    draw.text((x1, y1), labels[class_id]+":" +
              str(round(prob * 100, 1)) + "%", font=font, fill="#f90101")

newName = f"{pathImage.split('.')[0]}_V5_OUT.png"

uri_out = os.path.join(
    absolutePath, f"../public/uploads/{newName}")

print(f"{{\"uri_out\":\"{newName}\",\"status\":true,\"count\":{len(results)}}}")
img.save(uri_out)

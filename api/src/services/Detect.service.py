import onnxruntime as ort
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import sys
import os

labels = ['Cap1', 'Cap2', 'Cap3', 'Cap4', 'MOSFET',
          'Mov', 'Resestor', 'Resistor', 'Transformer']

img_width = 0
img_height = 0


# originalImg = sys.argv[1]
# modelPath = sys.argv[2]
# absolutePath = sys.argv[3]

originalImg = '662812_372668746_2326993304157035_7543143290248861195_n.png'
modelPath = 'C:\\WorkSpace\\Project\\ImageAnnotator\\api\\src\\assets\\models\\YOLOv8_best.onnx'
absolutePath = 'C:\\WorkSpace\\Project\\ImageAnnotator\\api\\src'


model = modelPath.split('\\')[-1].split('.')[0]

iouFilter = model == 'YOLOv8_best' and 0.6 or 0.1

session = ort.InferenceSession(modelPath, providers=['CPUExecutionProvider'])
# session._providers = ['CPUExecutionProvider']


def parse_rowV8(row):
    xc, yc, w, h = row[:4]
    x1 = (xc-w/2)/640*img_width
    y1 = (yc-h/2)/640*img_height
    x2 = (xc+w/2)/640*img_width
    y2 = (yc+h/2)/640*img_height
    prob = row[4:].max()
    class_id = row[4:].argmax()
    return [x1, y1, x2, y2, class_id, prob]


def parse_rowV5(row):
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


def prepare_img(img):
    inputs = session.get_inputs()
    input = inputs[0]
    img = Image.open(img)
    global img_width, img_height
    img_width, img_height = img.size
    img = img.resize((640, 640))
    img = img.convert("RGB")
    input = np.array(img)
    input = input.transpose(2, 0, 1)
    input = input.reshape(1, 3, 640, 640)
    input = input/255.0
    input = input.astype(np.float32)
    return input


def run_session(input):
    outputs = session.get_outputs()
    output = outputs[0]
    outputs = session.run([output.name], {"images": input})
    return outputs


def export_img(output):
    output = output[0]
    output = output[0]
    if (model == 'YOLOv8_best'):
        output = output.transpose()

    boxes = [row for row in [model == 'YOLOv8_best' and parse_rowV8(
        row) or parse_rowV5(row) for row in output] if row[5] > 0.5]
    boxes.sort(key=lambda x: x[5], reverse=True)
    results = []
    while len(boxes) > 0:
        results.append(boxes[0])
        boxes = [box for box in boxes if iou(
            box, boxes[0]) < iouFilter]

    img = Image.open(os.path.join(
        absolutePath, f"../public/uploads/{originalImg}"))
    draw = ImageDraw.Draw(img)
    font = ImageFont.truetype(os.path.join(
        absolutePath, f"assets/fonts/Gidole-Regular.ttf"), size=18)
    # print(results)
    for result in results:
        x1, y1, x2, y2, class_id, prob = result
        draw.rectangle((x1, y1, x2, y2), None, "#f90101", width=2)
        # draw.text((x1, y1), labels[class_id]+":" +
        #           str(round(prob * 100, 1)) + "%", font=font, fill="#f90101")

    uri_out = os.path.join(
        absolutePath, f"../public/uploads/{os.path.basename(originalImg.split('.')[0])}_out{model == 'YOLOv8_best' and 'V8' or 'V5'}.png")
    res_name_img = os.path.basename(originalImg.split(
        '.')[0])+f"_out{model == 'YOLOv8_best' and 'V8' or 'V5'}.png"
    img.save(uri_out)
    print(f"{{\"uri_out\":\"{res_name_img}\",\"status\":true,\"count\":{len(results)}}}")
    return 0


def main():
    # print(ort.__version__)
    input = prepare_img(
        os.path.join(absolutePath, f"../public/uploads/{originalImg}"))
    output = run_session(input)
    export_img(output)


main()

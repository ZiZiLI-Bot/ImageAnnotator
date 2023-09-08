import torch
from PIL import Image
from io import BytesIO
import base64
import sys
import os

absolutePath = sys.argv[3]
modelPath = sys.argv[2]
img = sys.argv[1]
# absolutePath = 'C:\\WorkSpace\\Project\\ImageAnnotator\\api\\src'
# modelPath = 'C:/WorkSpace/Project/ImageAnnotator/api/src/assets/models/YOLOv5_best.pt'
# img = '7775393_Chipset.jpg'


model = torch.hub.load(
    os.path.join(absolutePath, f'../yolov5'), 'custom', path=modelPath, force_reload=True, source='local')
model.conf = 0.4
img = os.path.join(absolutePath, f"../public/uploads/{img}")

results = model(img)
results.ims
results.render()
for im in results.ims:
    buffered = BytesIO()
    im_base64 = Image.fromarray(im)
    im_base64.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')

im = Image.open(BytesIO(base64.b64decode(img_str)))
output_name = os.path.basename(img.split('.')[1])+"_out.png"
im.save(os.path.join(absolutePath, f"../public/uploads/{output_name}"))

print("DONE")
print(f"{{\"uri_out\":\"{output_name}\",\"status\":true}}")

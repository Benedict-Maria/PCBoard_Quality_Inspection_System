import sys
from ultralytics import YOLO
import cv2

input_path = sys.argv[1]       # path to input image
output_path = sys.argv[2]      # path to save result image

model = YOLO("best.pt")        # load your trained model

results = model(input_path, conf=0.2)    # run detection
annotated_img = results[0].plot()   # draw bounding boxes

cv2.imwrite(output_path, annotated_img)   # save output image

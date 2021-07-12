from PIL import Image
import os, math

IMAGE_FOLDER = "images"
OUTPUT_FOLDER = "small-images"
MAX_OUTPUT_DIMENSION = 600;

input_images = os.listdir(IMAGE_FOLDER)
output_images = os.listdir(OUTPUT_FOLDER)

for image_file_name in input_images:
  if ".".join([image_file_name, "jpg"]) in output_images:
    continue
  print(image_file_name)
  try:
    img = Image.open(os.path.join(IMAGE_FOLDER, image_file_name)).convert("RGB")
  except ValueError:
    print("Can't read in {}".format(image_file_name))
  width, height = img.size
  h_ratio = MAX_OUTPUT_DIMENSION / height
  w_ratio = MAX_OUTPUT_DIMENSION / width
  min_ratio = min(1, min(h_ratio, w_ratio))
  newsize = (math.floor(min_ratio * width), math.floor(min_ratio * height))
  small_image = img.resize(newsize)
  output_filename = os.path.join(OUTPUT_FOLDER, ".".join([image_file_name, "jpg"]))
  small_image.save(output_filename, format="jpeg")

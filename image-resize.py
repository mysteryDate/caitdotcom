from skimage.transform import resize
from skimage.io import imread, imsave
import os, math

IMAGE_FOLDER = "images"
OUTPUT_FOLDER = "small-images"
MAX_OUTPUT_DIMENSION = 600;

input_images = os.listdir(IMAGE_FOLDER)
output_images = os.listdir(OUTPUT_FOLDER)

for image_file_name in input_images:
  print(image_file_name)
  if image_file_name in output_images:
    continue
  try:
    img = imread(os.path.join(IMAGE_FOLDER, image_file_name))
  except ValueError:
    print("Can't read in {}".format(image_file_name))
  height, width, dim = img.shape
  h_ratio = MAX_OUTPUT_DIMENSION / height
  w_ratio = MAX_OUTPUT_DIMENSION / width
  min_ratio = min(1, min(h_ratio, w_ratio))
  small_image = resize(img, (math.floor(min_ratio * height), math.floor(min_ratio * width)))
  imsave(os.path.join(OUTPUT_FOLDER, ".".join([image_file_name, "jpg"])), small_image[:,:,:3])

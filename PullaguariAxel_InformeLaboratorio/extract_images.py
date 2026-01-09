import json
import base64
import os

def extract_images_from_notebook(notebook_path, output_dir):
    with open(notebook_path, 'r', encoding='utf-8') as f:
        notebook = json.load(f)
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    image_count = 0
    for cell in notebook['cells']:
        if 'outputs' in cell:
            for output in cell['outputs']:
                if 'data' in output and 'image/png' in output['data']:
                    image_data = output['data']['image/png']
                    if isinstance(image_data, list):
                        image_data = "".join(image_data)
                    
                    image_bytes = base64.b64decode(image_data)
                    image_filename = f"lab2_plot_{image_count}.png"
                    image_path = os.path.join(output_dir, image_filename)
                    
                    with open(image_path, 'wb') as img_file:
                        img_file.write(image_bytes)
                    
                    print(f"Saved {image_path}")
                    image_count += 1

if __name__ == "__main__":
    notebook_path = r"c:\Users\apullaguari\Downloads\plantilla_informes_espe_v2\Laboratorio2 (1) (1).ipynb"
    output_dir = r"c:\Users\apullaguari\Downloads\plantilla_informes_espe_v2\images"
    extract_images_from_notebook(notebook_path, output_dir)

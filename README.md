# caitdotcom

Cait's portfolio site, hosted on GitHub Pages with a Decap/Sveltia CMS admin panel.

## Local Development

```
bash dev.sh
```

This single command:
- Enables `local_backend: true` in `admin/config.yml`
- Starts the Decap CMS proxy server (`decap-server`)
- Starts a live-reload file server (`live-server`)
- On Ctrl+C, shuts everything down and re-comments `local_backend`

Open http://localhost:8080/admin/ to access the CMS.

To test the Cloudflare OAuth worker separately: `npx wrangler dev`

## Image Resizer

The GitHub Actions workflow automatically resizes images on push, but you can run it locally too.

**Prerequisites:** Python 3 and Pillow (`pip install Pillow`)

```
python3 resize-images.py
```

This reads full-size images from `images/`, resizes them to fit within 600px, and writes JPEG thumbnails to `small-images/`. It skips images that already have a corresponding output file.

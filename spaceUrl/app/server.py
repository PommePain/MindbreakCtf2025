import urllib.request
from fastapi import FastAPI, Request, HTTPException
import urllib.parse
from pydantic import BaseModel
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from .database import *
import json
import os
import httpx

app = FastAPI()
app_dir = __file__.replace('/server.py', '')

templates = Jinja2Templates(directory="app/templates")
app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
)

blacklist = [
    'localhost', 'localhost:7494', 'file', 'file://', '127.0.0.1', '127.0.0.1:7494',
]

class UrlToParse(BaseModel):
    url: str
    query: str = None
    file_type: str = None

# Validation des URL envoyées dans upload-file-url
def validate_url(url: str) -> bool:
    url = url.replace(' ', '')
    parsed = urllib.parse.urlparse(url)
    print(parsed)
    if parsed.scheme in ['file', 'file://']:
        return False
    if ".." in url or "flag.txt" in parsed.query:
        return False
    return parsed.netloc not in blacklist

@app.get("/parse-file-url")
async def internal_req(request: Request, url: str, file_type: str = 'txt') -> dict:
    client = request.client.host
    if client not in ['127.0.0.1', 'localhost', '::1']:
        raise HTTPException(status_code=403, detail="Forbidden")

    path = f"{app_dir}/static/uploads"+url
    if not os.path.exists(path=path):
        return { "error": "Fichier non trouvé" }
    with open(path, 'r') as f:
        content = f.read()
        f.close()

    if file_type == 'json':
        content = json.loads(content)
    elif file_type == 'csv':
        content = content.split('\n')
        keys = content[0].split(',')
        content = [dict(zip(keys, line.split(','))) for line in content[1:]]

    return { "content": content }

@app.post("/upload-file-url")
async def upload_file_url(body: UrlToParse):
    # Validation de l'URL pour empêcher les requêtes 'internes'
    if not validate_url(body.url):
        return { "error": "Invalid URL" }
    elif body.file_type not in ['json', 'csv', 'txt']:
        return { "error": "Invalid file type" }
    body.url = urllib.parse.unquote(body.url)
    body.url = body.url.strip()

    # Requête pour récupérer le contenu du fichier à importer
    async with httpx.AsyncClient() as client:
        res = await client.get(body.url, timeout=5, follow_redirects=True)
        res.raise_for_status()
        if res.status_code != 200:
            content = "Erreur durant le traitement"
        else:
            content = res.read()
            content = content.decode('utf-8')

    file_name = body.url.split('/')[-1]
    db = next(get_db())
    db_file = insert_file(db, file_name, body.url, body.file_type)
    # Ecriture du contenu dans un fichier final
    with open(f'{app_dir}/static/uploads/{db_file.id}.{body.file_type}', 'w') as f:
        f.write(content)
        f.close()
        db_file.url = body.url
        db.commit()
        db.refresh(db_file)

    return {
        "success": True,
        "file_id": db_file.id,
        "file_url": db_file.url,
        "path": f'{app_dir}/static/uploads/{db_file.id}.{body.file_type}'
    }

@app.get("/")
async def root(request : Request):
    files = get_files(next(get_db()))
    return templates.TemplateResponse("index.html",
        {
            "request": request,
            "title": "Accueil",
            "files": files
        }
    )

@app.get("/file/{file_id}")
async def file(request: Request, file_id: str):
    db = next(get_db())
    file = get_file_by_id(db, file_id)
    if (file): file_content = open(f"{app_dir}/static/uploads/{file.id}.{file.file_type}", 'r').read()
    else: file_content = None

    return templates.TemplateResponse("file.html",
        {
            "request": request,
            "title": "Fichier uploadé",
            "file": file,
            "file_content": file_content
        }
    )

@app.delete("/file/{file_id}")
async def delete_file(file_id: str):
    db = next(get_db())
    file = get_file_by_id(db, file_id)
    db.delete(file)
    db.commit()
    return { "success": True }

@app.delete("/uploaded-files")
async def delete_all_files():
    db = next(get_db())
    db.query(UploadedFile).delete()
    db.commit()

    # Suppression de tous les fichiers stockés dans les uploads
    for file in os.listdir(f'{app_dir}/static/uploads'):
        if file.endswith('.json') or file.endswith('.csv') or file.endswith('.txt'):
            os.remove(f'{app_dir}/static/uploads/{file}')

    return { "success": True }

# Filtre de formattage de date pour le front
def format_date(value: str) -> str:
    date = value.split(' ')[0]
    return date.split('-')[2] + '/' + date.split('-')[1] + '/' + date.split('-')[0]
templates.env.filters["format_date"] = format_date

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=7494) 

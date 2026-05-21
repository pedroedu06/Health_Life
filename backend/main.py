from fastapi import FastAPI
from pydantic import BaseModel
from resultado import recomendar_alimentos
from fastapi.middleware.cors import CORSMiddleware

class alimento(BaseModel):
    alimento: str
    objetivo: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type", "Authorization"],
)

@app.post('/recomendar')
def comparar(data: alimento):
    resultado = recomendar_alimentos (
        nome_alimento=data.alimento,
        objetivo=data.objetivo
    )

    return resultado

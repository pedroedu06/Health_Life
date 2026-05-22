from fastapi import FastAPI
from typing import Optional
from pydantic import BaseModel
from resultado import recomendar_alimentos
from fastapi.middleware.cors import CORSMiddleware
from limpeza import carregarDados, calcularTempoGasto, getCaloriasporAlimento

df, colunas_nutricionais, X = carregarDados()

class alimento(BaseModel):
    alimento: str
    objetivo: Optional[str] = ""

class gastoCalorico(BaseModel):
    alimento: str
    peso: float

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
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

@app.post('/gastoCalorico')
def gasto(data: gastoCalorico):
    calorias, descricao = getCaloriasporAlimento(df, data.alimento)
    tempos = calcularTempoGasto(calorias, data.peso)
    tempos["alimento_base"] = descricao
    tempos["calorias"] = round(calorias, 1)

    return tempos

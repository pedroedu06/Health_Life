# Projeto ML-Data

Sistema de recomendação de alimentos usando Machine Learning com backend em FastAPI e frontend em React.

## Pré-requisitos

- Python 3.10+
- Node.js 18+

## Instalação

### Backend

```bash
pip install -r requirements.txt
```

### Frontend

```bash
cd public
npm install
```

## Como rodar

### Backend

```bash
cd backend
python -m uvicorn main:app --reload
```

O servidor estará disponível em `http://localhost:8000`.

### Frontend

```bash
cd public
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

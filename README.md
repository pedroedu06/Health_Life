# Health Life

Sistema de recomendação de alimentos com Machine Learning. Você informa um alimento e, opcionalmente, um objetivo nutricional (ex.: mais proteína, menos sódio), e o sistema sugere alimentos nutricionalmente parecidos. Também estima quanto tempo de atividade física é preciso para gastar as calorias de um alimento.

- **Backend:** Python + FastAPI
- **Frontend:** React + TypeScript (Vite)
- **Dados:** tabela de composição nutricional com 597 alimentos ([backend/data/alimentos.csv](backend/data/alimentos.csv))

## Funcionalidades

- **Busca textual tolerante:** encontra o alimento mesmo sem acentos ou com a descrição incompleta (ex.: `frango grelhado`).
- **Recomendação por similaridade:** compara 16 nutrientes (energia, proteína, lipídeos, carboidrato, fibra, minerais e vitaminas) usando similaridade de cosseno.
- **Ranking por objetivo:** reordena as recomendações conforme o objetivo escolhido.
- **Gasto calórico:** calcula os minutos de caminhada, corrida, ciclismo, natação e musculação necessários para gastar as calorias do alimento, com base no peso do usuário.

## Como funciona

1. **Limpeza dos dados** ([limpeza.py](backend/limpeza.py)): seleciona as colunas nutricionais, preenche valores nulos com a média (ou mediana) da categoria do alimento e remove carnes cruas.
2. **Busca** ([busca_textual.py](backend/busca_textual.py)): normaliza o texto (minúsculas, sem acentos e stopwords) e pontua cada alimento pela quantidade de palavras em comum com a busca, com bônus quando o modo de preparo coincide (cru, cozido, grelhado...).
3. **Similaridade** ([similaridade.py](backend/similaridade.py), [resultado.py](backend/resultado.py)): os nutrientes são padronizados com `StandardScaler` e comparados com similaridade de cosseno.
4. **Ranking** ([rankObjetivo.py](backend/rankObjetivo.py)): dos 50 alimentos mais parecidos, mantém só os de categorias compatíveis (ex.: carnes com carnes e pratos preparados) e retorna os 10 melhores — por similaridade ou, se houver objetivo, pelo nutriente do objetivo.
5. **Gasto calórico** ([limpeza.py](backend/limpeza.py)): `tempo (min) = calorias / (MET × peso) × 60`.

### Objetivos disponíveis

| Objetivo | Nutriente | Ordem |
| --- | --- | --- |
| `menos_calorias` | Energia (kcal) | menor primeiro |
| `mais_proteina` | Proteína (g) | maior primeiro |
| `menos_gordura` | Lipídeos (g) | menor primeiro |
| `menos_carboidrato` | Carboidrato (g) | menor primeiro |
| `mais_fibra` | Fibra alimentar (g) | maior primeiro |
| `menos_sodio` | Sódio (mg) | menor primeiro |
| `mais_calcio` | Cálcio (mg) | maior primeiro |
| `mais_ferro` | Ferro (mg) | maior primeiro |
| `mais_potassio` | Potássio (mg) | maior primeiro |
| `mais_vitamina_c` | Vitamina C (mg) | maior primeiro |

## Pré-requisitos

- Python 3.10+
- Node.js 18+ e npm

## Instalação

```bash
git clone https://github.com/pedroedu06/Health_Life.git
cd Health_Life
```

**Backend** (na raiz do projeto, onde fica o `requirements.txt`):

```bash
pip install -r requirements.txt
```

**Frontend:**

```bash
cd public
npm install
```

## Como rodar

Use dois terminais.

**1. Backend** — disponível em `http://localhost:8000` (documentação interativa em `http://localhost:8000/docs`):

```bash
cd backend
python -m uvicorn main:app --reload
```

**2. Frontend** — disponível em `http://localhost:5173`:

```bash
cd public
npm run dev
```

> O backend só aceita requisições (CORS) de `http://localhost:5173` e `http://localhost:5174`. Se o Vite subir em outra porta, ajuste `allow_origins` em [main.py](backend/main.py).

## API

### `POST /recomendar`

```json
{ "alimento": "frango grelhado", "objetivo": "mais_proteina" }
```

`objetivo` é opcional; sem ele, o ranking é feito só por similaridade. Resposta:

```json
{
  "alimento_base": "Frango, coração, grelhado",
  "objetivo": "mais_proteina",
  "resultados": [
    {
      "indice": 335,
      "nome": "Carne, bovina, contra-filé, sem gordura, grelhado",
      "similaridade": 0.735,
      "valor_objetivo": 35.9,
      "objetivo": "mais_proteina",
      "score_final": 1.0
    }
  ]
}
```

`valor_objetivo`, `objetivo` e `score_final` só aparecem quando um objetivo é informado.

### `POST /gastoCalorico`

```json
{ "alimento": "arroz integral cozido", "peso": 72 }
```

Resposta (minutos por atividade):

```json
{
  "caminhada": 30,
  "corrida": 13,
  "ciclismo": 17,
  "natacao": 15,
  "musculacao": 21,
  "alimento_base": "Arroz, integral, cozido",
  "calorias": 124.0
}
```

## Estrutura do projeto

```
Health_Life/
├── requirements.txt        # Dependências Python
├── backend/
│   ├── data/alimentos.csv  # Base de dados nutricional
│   ├── main.py             # App FastAPI e endpoints
│   ├── limpeza.py          # Carga/limpeza dos dados e cálculo de gasto calórico
│   ├── busca_textual.py    # Busca do alimento pelo nome
│   ├── similaridade.py     # Normalização dos nutrientes (StandardScaler)
│   ├── resultado.py        # Monta a recomendação (similaridade de cosseno)
│   └── rankObjetivo.py     # Filtro por categoria e ranking por objetivo
└── public/                 # Frontend React + TypeScript (Vite)
    ├── index.html
    ├── package.json
    └── src/
        ├── App.tsx                   # Tela principal (formulários e gasto calórico)
        └── components/RankingList.tsx # Lista do ranking
```

## Tecnologias

- **Backend:** FastAPI, Uvicorn, Pydantic, pandas, scikit-learn, Unidecode
- **Frontend:** React 19, TypeScript, Vite, ESLint

## Contribuição

1. Faça um fork do repositório.
2. Crie uma branch: `git checkout -b feature/sua-feature`
3. Faça commit das alterações: `git commit -m "Adiciona nova feature"`
4. Envie a branch: `git push origin feature/sua-feature`
5. Abra um Pull Request.

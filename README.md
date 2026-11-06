# Health Life

Sistema de recomendação de alimentos com Machine Learning. Você informa um alimento e, opcionalmente, um objetivo nutricional (ex.: mais proteína, menos sódio), e o sistema sugere alimentos nutricionalmente parecidos. Também estima quanto tempo de atividade física é preciso para gastar as calorias de um alimento.

- **Backend:** Python + FastAPI
- **Frontend:** React + TypeScript (Vite)
- **Dados:** TACO, com 597 alimentos (veja [Dados nutricionais](#dados-nutricionais))

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

## Dados nutricionais

A base vem da TACO (Tabela Brasileira de Composição de Alimentos), publicada pelo NEPA/UNICAMP.

| Item | Valor |
| --- | --- |
| Edição da TACO | **TODO:** confirmar a edição usada |
| Fonte | TACO, NEPA/UNICAMP. **TODO:** informar o link de onde o CSV foi obtido |
| Arquivo | `alimentos.csv` |
| Local | [backend/data/](backend/data/alimentos.csv) |
| Conteúdo | 597 alimentos, 15 categorias e 29 colunas (UTF-8, fim de linha LF) |
| SHA-256 | `8c0f7c701eadc9d2afa2711688e3d9523a3a2ad0c1ebcf1fa2fc9e6d08f916ab` |

Para conferir o checksum, na raiz do projeto:

```bash
sha256sum backend/data/alimentos.csv
```

> No Windows com `core.autocrlf=true`, o Git troca LF por CRLF no checkout e o comando acima retorna outro valor (`248464f4...`). Nesse caso, confira a versão versionada no Git Bash:
>
> ```bash
> git show HEAD:backend/data/alimentos.csv | sha256sum
> ```

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

Base local: `http://localhost:8000`. As requisições e respostas usam JSON.

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/recomendar` | Recomenda alimentos parecidos com o informado |
| `POST` | `/gastoCalorico` | Calcula os minutos de atividade para gastar as calorias do alimento |

O FastAPI também serve a documentação em `/docs`, `/redoc` e `/openapi.json`.

### `POST /recomendar`

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `alimento` | string | sim | Nome do alimento buscado |
| `objetivo` | string | não | Um dos [objetivos disponíveis](#objetivos-disponíveis). Valor ausente ou desconhecido ordena só por similaridade |

Requisição:

```bash
curl -X POST http://localhost:8000/recomendar -H "Content-Type: application/json" -d '{"alimento": "frango grelhado", "objetivo": "mais_proteina"}'
```

Resposta (`200`), com até 10 itens em `resultados` (aqui, só o primeiro):

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

`valor_objetivo`, `objetivo` e `score_final` só aparecem nos itens quando um objetivo válido é informado. Sem objetivo, o campo `objetivo` da raiz volta como `""`.

Se nenhum alimento combinar com a busca, a rota não retorna erro: ela usa o primeiro alimento da base (`Arroz, integral, cozido`) como `alimento_base`.

### `POST /gastoCalorico`

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `alimento` | string | sim | Nome do alimento buscado |
| `peso` | número | sim | Peso do usuário em kg, maior que zero |

Requisição:

```bash
curl -X POST http://localhost:8000/gastoCalorico -H "Content-Type: application/json" -d '{"alimento": "arroz integral cozido", "peso": 72}'
```

Resposta (`200`), com os minutos por atividade:

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

Alimento não encontrado ou `peso` igual a zero retornam `500`.

### Erros de validação

Nas duas rotas, um campo obrigatório ausente ou de tipo inválido retorna `422` com os detalhes em `detail`.

## Testes

Versão do Python usada na execução dos testes: **3.14.0**.

As dependências de teste (`pytest` e `pytest-cov`) estão no `requirements.txt`. Para rodar os testes com cobertura:

```bash
cd backend
pytest --cov
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

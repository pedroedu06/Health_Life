Health_Life: Sistema de Recomendação de Alimentos Inteligente


Visão Geral do Projeto

O projeto Health_Life é um sistema inovador de recomendação de alimentos que utiliza técnicas de Machine Learning para oferecer sugestões personalizadas aos usuários. Desenvolvido com um backend robusto em FastAPI (Python) e um frontend dinâmico em React (TypeScript), o sistema visa auxiliar indivíduos na tomada de decisões alimentares mais saudáveis e alinhadas aos seus objetivos nutricionais.

Através da aplicação de similaridade de cosseno, o sistema analisa as características nutricionais dos alimentos e os objetivos do usuário para gerar um ranking de recomendações. Além disso, oferece uma funcionalidade para calcular o gasto calórico estimado com base no consumo de alimentos e peso do usuário, proporcionando uma ferramenta completa para o gerenciamento da dieta.

Funcionalidades Principais

•
Recomendação Personalizada de Alimentos: Sugere alimentos com base nas preferências e objetivos nutricionais do usuári

•
o, utilizando algoritmos de similaridade de cosseno.

•
Cálculo de Gasto Calórico: Estima o tempo necessário para queimar as calorias de um alimento específico, considerando o peso do usuário e diferentes atividades físicas.

•
Interface Intuitiva: Frontend desenvolvido em React para uma experiência de usuário fluida e responsiva.

•
API RESTful: Backend em FastAPI que expõe endpoints eficientes para a comunicação com o frontend e o processamento dos dados.

Arquitetura do Sistema

O Health_Life adota uma arquitetura de microsserviços, separando claramente as responsabilidades do backend e do frontend:

•
Backend (FastAPI): Responsável pela lógica de negócios, processamento de dados de Machine Learning (similaridade de cosseno), cálculo de gasto calórico e exposição da API RESTful. Utiliza Python e bibliotecas como pandas, numpy e scikit-learn para manipulação e análise de dados.

•
Frontend (React): Desenvolvido com React e TypeScript, oferece a interface de usuário interativa. Consome os dados e funcionalidades expostas pelo backend através de requisições HTTP.

Tecnologias Utilizadas

Backend

•
Python 3.10+: Linguagem de programação principal.

•
FastAPI: Framework web moderno e rápido para construção de APIs.

•
Uvicorn: Servidor ASGI para rodar aplicações FastAPI.

•
Pydantic: Para validação de dados e configurações.

•
Pandas: Manipulação e análise de dados.

•
NumPy: Suporte a operações numéricas de alto desempenho.

•
Scikit-learn: Implementação de algoritmos de Machine Learning (similaridade de cosseno).

•
FastAPI-CORS: Middleware para habilitar Cross-Origin Resource Sharing (CORS).

Frontend

•
Node.js 18+: Ambiente de execução JavaScript.

•
React: Biblioteca JavaScript para construção de interfaces de usuário.

•
TypeScript: Superset de JavaScript que adiciona tipagem estática.

•
Vite: Ferramenta de build frontend rápida.

•
ESLint: Ferramenta para identificar e reportar padrões problemáticos encontrados no código JavaScript/TypeScript.

Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em seu ambiente de desenvolvimento:

•
Python 3.10+

•
Node.js 18+

•
npm (gerenciador de pacotes do Node.js)

Instalação

Siga os passos abaixo para configurar e rodar o projeto em sua máquina local.

1. Clonar o Repositório

Bash


git clone https://github.com/pedroedu06/Health_Life.git
cd Health_Life



2. Configurar o Backend

Navegue até o diretório backend e instale as dependências Python:

Bash


cd backend
pip install -r requirements.txt



3. Configurar o Frontend

Navegue até o diretório public e instale as dependências Node.js:

Bash


cd ../public
npm install



Como Rodar

Para iniciar o backend e o frontend, siga as instruções:

1. Iniciar o Backend

No diretório backend, execute o seguinte comando:

Bash


cd backend
python -m uvicorn main:app --reload



O servidor da API estará disponível em http://localhost:8000.

2. Iniciar o Frontend

Em um novo terminal, no diretório public, execute o seguinte comando:

Bash


cd public
npm run dev



O frontend estará acessível em http://localhost:5173.

Estrutura do Projeto

Plain Text


Health_Life/
├── backend/                  # Código do backend (FastAPI, lógica de ML )
│   ├── data/                 # Dados utilizados pelo modelo de ML
│   ├── limpeza.py            # Script para limpeza e pré-processamento de dados
│   ├── busca_textual.py      # Lógica para busca textual de alimentos
│   ├── similaridade.py       # Implementação da similaridade de cosseno
│   ├── rankObjetivo.py       # Lógica para ranking de alimentos por objetivo
│   ├── resultado.py          # Funções para gerar recomendações e calcular gasto calórico
│   ├── main.py               # Aplicação FastAPI e endpoints da API
│   └── requirements.txt      # Dependências Python
├── public/                   # Código do frontend (React, TypeScript)
│   ├── src/                  # Componentes React, lógica do frontend
│   ├── index.html            # Arquivo HTML principal
│   ├── package.json          # Dependências e scripts do frontend
│   └── ...                   # Outros arquivos de configuração e assets do frontend
├── README.md                 # Este arquivo
└── .gitignore                # Arquivos e diretórios a serem ignorados pelo Git



Contribuição

Contribuições são bem-vindas! Se você deseja contribuir para o projeto, por favor, siga estas etapas:

1.
Faça um fork do repositório.

2.
Crie uma nova branch (git checkout -b feature/sua-feature).

3.
Faça suas alterações e commit (git commit -m 'Adiciona nova feature').

4.
Envie para a branch (git push origin feature/sua-feature).

5.
Abra um Pull Request.



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

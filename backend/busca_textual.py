import re
from unidecode import unidecode

STOPWORDS = {
    "de", "da", "do", "das", "dos", "e", "com"
}

PREPAROS = {
    "crua", "cru",
    "frita", "frito",
    "cozida", "cozido",
    "assada", "assado",
    "grelhada", "grelhado",
    "refogada", "refogado"
}

def limpar_texto(texto):
    texto = unidecode(str(texto).lower())

    texto = re.sub(r"[,.;:/()-]", " ", texto)

    texto = " ".join(texto.split())

    return texto


def tokenizar(texto):
    texto = limpar_texto(texto)

    tokens = texto.split()

    tokens = [t for t in tokens if t not in STOPWORDS]

    return set(tokens)


def preparar_dataframe(df):

    df["descricao_limpa"] = df["Descrição dos alimentos"].apply(
        limpar_texto
    )

    df["tokens"] = df["descricao_limpa"].apply(
        tokenizar
    )

    return df


def buscar_alimento(df, consulta, top_n=5):

    tokens_usuario = tokenizar(consulta)

    resultados = []

    for idx, row in df.iterrows():

        tokens_alimento = row["tokens"]

        tokens_normais_usuario = tokens_usuario - PREPAROS
        tokens_normais_alimento = tokens_alimento - PREPAROS

        preparo_usuario = tokens_usuario & PREPAROS
        preparo_alimento = tokens_alimento & PREPAROS


        intersecao_principal = (
        tokens_normais_usuario &
        tokens_normais_alimento
        )

        score = len(intersecao_principal) * 1.0

        if preparo_usuario and preparo_usuario == preparo_alimento:
            score += 0.3

        score = score / len(tokens_usuario)

        resultados.append({
            "indice": idx,
            "descricao": row["Descrição dos alimentos"],
            "score": score
        })

    resultados.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return resultados[:top_n]
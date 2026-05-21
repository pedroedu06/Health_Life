from limpeza import carregarDados
from busca_textual import preparar_dataframe
from busca_textual import buscar_alimento
from similaridade import x_normalizado
from sklearn.metrics.pairwise import cosine_similarity
from rankObjetivo import rankear_por_objetivo

def recomendar_alimentos(nome_alimento, objetivo):
    df, colunas_nutricionais, X = carregarDados()
    df = preparar_dataframe(df)

    resultado = buscar_alimento(
            df,
            nome_alimento
        )

    melhor_resultado = resultado[0]
    indice_base = melhor_resultado['indice']

    similaridades = cosine_similarity(
            [x_normalizado[indice_base]],
            x_normalizado
        )[0]


    resultado_filtrado = rankear_por_objetivo(
            df,
            indice_base=indice_base,
            similaridades=similaridades,
            x_normalizado=x_normalizado,
            objetivo=objetivo
        )

    return {
        "alimento_base": str(melhor_resultado["descricao"]),
        "objetivo": str(objetivo),
        "resultados": resultado_filtrado
    }

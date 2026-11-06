import numpy as np
import pandas as pd
import pytest
from sklearn.metrics.pairwise import cosine_similarity

from busca_textual import buscar_alimento, preparar_dataframe
from rankObjetivo import rankear_por_objetivo


def criar_df(linhas):
    return pd.DataFrame(
        linhas,
        columns=[
            "Categoria do alimento",
            "Descrição dos alimentos",
            "Proteína..g.",
            "Energia..kcal.",
        ],
    )


@pytest.fixture
def df_frutas():
    """Base no índice 0, seguida de 15 frutas com proteína e energia crescentes."""
    linhas = [("Frutas e derivados", "Base", 0.5, 50.0)]
    linhas += [
        ("Frutas e derivados", f"Fruta {i}", float(i), float(100 + i))
        for i in range(1, 16)
    ]
    return criar_df(linhas)


@pytest.fixture
def similaridades():
    """Base com 1.0 e as demais decrescendo: Fruta 1 é a mais parecida."""
    return np.array([1.0] + [0.9 - i * 0.01 for i in range(15)])


def test_ranking_sem_objetivo_tem_no_maximo_10_itens(df_frutas, similaridades):
    resultados = rankear_por_objetivo(df_frutas, 0, similaridades)

    assert [r["nome"] for r in resultados] == [f"Fruta {i}" for i in range(1, 11)]


def test_ranking_com_objetivo_tem_no_maximo_10_itens(df_frutas, similaridades):
    resultados = rankear_por_objetivo(
        df_frutas, 0, similaridades, objetivo="mais_proteina"
    )

    assert len(resultados) == 10


def test_objetivo_mais_proteina_ordena_do_maior_para_o_menor(df_frutas, similaridades):
    resultados = rankear_por_objetivo(
        df_frutas, 0, similaridades, objetivo="mais_proteina"
    )

    assert [r["valor_objetivo"] for r in resultados] == [
        15.0, 14.0, 13.0, 12.0, 11.0, 10.0, 9.0, 8.0, 7.0, 6.0,
    ]
    assert resultados[0]["score_final"] == 1.0


def test_objetivo_menos_calorias_ordena_do_menor_para_o_maior(df_frutas, similaridades):
    resultados = rankear_por_objetivo(
        df_frutas, 0, similaridades, objetivo="menos_calorias"
    )

    assert [r["valor_objetivo"] for r in resultados][:3] == [101.0, 102.0, 103.0]
    assert resultados[0]["score_final"] == 1.0


def test_objetivo_desconhecido_cai_na_ordem_por_similaridade(df_frutas, similaridades):
    resultados = rankear_por_objetivo(
        df_frutas, 0, similaridades, objetivo="objetivo_inventado"
    )

    assert resultados[0]["nome"] == "Fruta 1"
    assert "valor_objetivo" not in resultados[0]


def test_ranking_exclui_categorias_fora_do_grupo():
    df = criar_df([
        ("Frutas e derivados", "Banana, prata, crua", 1.3, 98.0),
        ("Carnes e derivados", "Carne, bovina, patinho, grelhado", 35.9, 219.0),
        ("Frutas e derivados", "Maçã, Fuji, com casca, crua", 0.3, 56.0),
    ])

    resultados = rankear_por_objetivo(df, 0, np.array([1.0, 0.9, 0.5]))

    assert [r["nome"] for r in resultados] == ["Maçã, Fuji, com casca, crua"]


def test_buscar_leite_nao_coloca_leite_condensado_no_topo():
    # Mesma ordem relativa de data/alimentos.csv.
    df = preparar_dataframe(pd.DataFrame({
        "Descrição dos alimentos": [
            "Leite, condensado",
            "Leite, de vaca, desnatado, UHT",
            "Leite, de vaca, integral",
        ],
    }))

    resultados = buscar_alimento(df, "leite")

    assert resultados[0]["descricao"] != "Leite, condensado"


def test_alimento_base_nao_aparece_nas_proprias_recomendacoes():
    # Vetores idênticos, como os óleos da TACO: empatam em similaridade 1.0.
    df = criar_df([
        ("Gorduras e óleos", "Óleo, de soja", 0.0, 884.0),
        ("Gorduras e óleos", "Óleo, de milho", 0.0, 884.0),
        ("Gorduras e óleos", "Manteiga, com sal", 0.4, 726.0),
    ])
    vetores = np.array([[1.0, 0.0], [1.0, 0.0], [1.0, 1.0]])
    similaridades = cosine_similarity([vetores[0]], vetores)[0]

    resultados = rankear_por_objetivo(df, 0, similaridades)

    assert "Óleo, de soja" not in [r["nome"] for r in resultados]


def test_objetivo_sem_candidatos_na_categoria_retorna_vazio():
    df = criar_df([
        ("Ovos e derivados", "Ovo, de galinha, clara, cozida", 13.4, 59.0),
        ("Carnes e derivados", "Carne, bovina, patinho, grelhado", 35.9, 219.0),
    ])

    resultados = rankear_por_objetivo(
        df, 0, np.array([1.0, 0.9]), objetivo="mais_proteina"
    )

    assert resultados == []

import pandas as pd
import pytest

from busca_textual import buscar_alimento, limpar_texto, preparar_dataframe, tokenizar


def criar_df(descricoes):
    return preparar_dataframe(pd.DataFrame({"Descrição dos alimentos": descricoes}))


@pytest.fixture
def df_alimentos():
    return criar_df([
        "Feijão, carioca, cozido",
        "Arroz, integral, cozido",
        "Leite, de vaca, integral",
        "Arroz, tipo 1, cru",
        "Banana, prata, crua",
    ])


def test_limpar_texto_remove_acento_caixa_e_pontuacao():
    assert limpar_texto("Feijão, CARIOCA (cozido)") == "feijao carioca cozido"


def test_tokenizar_remove_stopwords():
    assert tokenizar("Arroz com feijão e farinha de mandioca") == {
        "arroz", "feijao", "farinha", "mandioca",
    }


def test_arroz_retorna_itens_de_arroz(df_alimentos):
    resultados = buscar_alimento(df_alimentos, "arroz", top_n=2)

    assert [r["descricao"] for r in resultados] == [
        "Arroz, integral, cozido",
        "Arroz, tipo 1, cru",
    ]
    assert [r["indice"] for r in resultados] == [1, 3]
    assert all(r["score"] == 1.0 for r in resultados)


def test_busca_ignora_acento_e_caixa(df_alimentos):
    resultados = buscar_alimento(df_alimentos, "FEIJAO", top_n=1)

    assert resultados[0]["descricao"] == "Feijão, carioca, cozido"


def test_preparo_igual_ao_da_consulta_ganha_bonus():
    df = criar_df(["Frango, peito, cozido", "Frango, peito, grelhado"])

    resultados = buscar_alimento(df, "frango grelhado")

    assert resultados[0]["descricao"] == "Frango, peito, grelhado"
    assert resultados[0]["score"] == pytest.approx(0.65)
    assert resultados[1]["score"] == pytest.approx(0.5)


def test_top_n_limita_quantidade_de_resultados(df_alimentos):
    assert len(buscar_alimento(df_alimentos, "arroz", top_n=1)) == 1


def test_termo_inexistente_retorna_vazio(df_alimentos):
    assert buscar_alimento(df_alimentos, "xyzabc") == []


@pytest.mark.parametrize("consulta", ["", "   ", "de"])
def test_consulta_sem_tokens_retorna_vazio(df_alimentos, consulta):
    assert buscar_alimento(df_alimentos, consulta) == []

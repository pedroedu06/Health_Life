import numpy as np
import pytest

from limpeza import carregar_dados

COLUNAS_NUTRICIONAIS = [
    "Energia..kcal.", "Proteína..g.", "Lipídeos..g.", "Carboidrato..g.",
    "Fibra.Alimentar..g.", "Cálcio..mg.", "Ferro..mg.", "Sódio..mg.",
    "Potássio..mg.", "Magnésio..mg.", "Fósforo..mg.", "Tiamina..mg.",
    "Riboflavina..mg.", "Niacina..mg.", "Piridoxina..mg.", "Vitamina.C..mg.",
]


@pytest.fixture(scope="module")
def dados():
    return carregar_dados()


def test_carregar_dados_retorna_colunas_esperadas(dados):
    df, colunas_nutricionais, _ = dados

    assert colunas_nutricionais == COLUNAS_NUTRICIONAIS
    assert list(df.columns) == [
        "Categoria do alimento", "Descrição dos alimentos", *COLUNAS_NUTRICIONAIS,
    ]


def test_carregar_dados_retorna_matriz_alinhada_e_sem_nulos(dados):
    df, colunas_nutricionais, X = dados

    assert len(df) > 0
    assert X.shape == (len(df), len(colunas_nutricionais))
    assert not np.isnan(X).any()


def test_carregar_dados_remove_carnes_cruas(dados):
    df, _, _ = dados

    carnes = df[df["Categoria do alimento"] == "Carnes e derivados"]
    descricoes = carnes["Descrição dos alimentos"].str.lower()

    assert len(carnes) > 0
    assert not descricoes.str.endswith(("cru", "crua")).any()

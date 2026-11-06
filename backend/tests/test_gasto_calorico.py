import pandas as pd
import pytest

from limpeza import calcularTempoGasto, get_calorias_por_alimento


def test_tempo_gasto_calculado_por_atividade():
    assert calcularTempoGasto(100, 70) == {
        "caminhada": 24,
        "corrida": 11,
        "ciclismo": 14,
        "natacao": 12,
        "musculacao": 17,
    }


def test_tempo_gasto_muda_com_o_peso():
    leve = calcularTempoGasto(300, 60)
    pesado = calcularTempoGasto(300, 120)

    assert leve["caminhada"] == 86
    assert pesado["caminhada"] == 43
    assert all(pesado[atividade] < leve[atividade] for atividade in leve)


def test_tempo_gasto_muda_com_a_intensidade_da_atividade():
    tempos = calcularTempoGasto(300, 70)

    assert (
        tempos["corrida"]
        < tempos["natacao"]
        < tempos["ciclismo"]
        < tempos["musculacao"]
        < tempos["caminhada"]
    )


def test_tempo_gasto_cresce_com_as_calorias():
    assert calcularTempoGasto(200, 70)["corrida"] == 21
    assert calcularTempoGasto(400, 70)["corrida"] == 43


@pytest.fixture
def df_calorias():
    return pd.DataFrame({
        "Descrição dos alimentos": ["Arroz, tipo 1, cozido", "Banana, prata, crua"],
        "Energia..kcal.": [128.0, 98.0],
    })


def test_get_calorias_retorna_energia_e_descricao(df_calorias):
    assert get_calorias_por_alimento(df_calorias, "banana") == (98.0, "Banana, prata, crua")


def test_get_calorias_de_alimento_inexistente_levanta_erro(df_calorias):
    with pytest.raises(ValueError, match="xyzabc"):
        get_calorias_por_alimento(df_calorias, "xyzabc")

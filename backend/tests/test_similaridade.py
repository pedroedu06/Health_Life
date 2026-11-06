import pytest
from sklearn.metrics.pairwise import cosine_similarity

# resultado.py usa cosine_similarity do sklearn diretamente. Importar resultado ou
# similaridade aqui carregaria a base TACO inteira, por isso o import vem do sklearn.


def test_vetor_comparado_consigo_mesmo_da_1():
    vetor = [3.0, 4.0, 12.0]

    assert cosine_similarity([vetor], [vetor])[0][0] == pytest.approx(1.0)


def test_vetores_ortogonais_dao_0():
    assert cosine_similarity([[1.0, 0.0]], [[0.0, 5.0]])[0][0] == pytest.approx(0.0)

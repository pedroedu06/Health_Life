from limpeza import carregarDados
from busca_textual import preparar_dataframe
from busca_textual import buscar_alimento

df, colunas_nutricionais = carregarDados()
df = preparar_dataframe(df)

resultado = buscar_alimento(
    df,
    "file mingnon"
)

print(resultado)
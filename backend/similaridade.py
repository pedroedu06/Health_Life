from sklearn.preprocessing import StandardScaler
from limpeza import carregarDados

df, colunas_nutricionais, X = carregarDados();

scaler = StandardScaler()
x_normalizado = scaler.fit_transform(X)


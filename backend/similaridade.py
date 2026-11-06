from sklearn.preprocessing import StandardScaler
from limpeza import carregar_dados

df, colunas_nutricionais, X = carregar_dados();

scaler = StandardScaler()
x_normalizado = scaler.fit_transform(X)


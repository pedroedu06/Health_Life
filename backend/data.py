import pandas as pd
import os

base_path = os.path.dirname(__file__)

df = pd.read_csv(os.path.join(base_path, './data/alimentos.csv'))

""" print(df.isnull().sum())

total = len(df)
nulos = df['Colesterol..mg.'].isnull().sum()
print(f"{nulos/total*100:.1f}%") 

nulos = (df.isnull().sum() / len(df) *100).sort_values(ascending=False)
print(nulos[nulos>0]) """

# limpeza de colunas principais usadas na aplicacao.
colunas_nutricionais = [
    'Energia..kcal.', 'Proteína..g.', 'Lipídeos..g.', 'Carboidrato..g.', 'Fibra.Alimentar..g.',
    'Cálcio..mg.', 'Ferro..mg.', 'Sódio..mg.', 'Potássio..mg.', 'Magnésio..mg.', 'Fósforo..mg.',
    'Tiamina..mg.', 'Riboflavina..mg.', 'Niacina..mg.', 'Piridoxina..mg.', 'Vitamina.C..mg.'
]

df = df[['Categoria do alimento', 'Descrição dos alimentos'] + colunas_nutricionais]

#nova verificacao de dados nulos apos limpeza de colunas.
nulos = (df.isnull().sum() / len(df) *100).sort_values(ascending=False)
# print(nulos[nulos>0]);

"""['Categoria do alimento', 'Descrição dos alimentos', 
'Energia..kcal.', 'Proteína..g.', 'Lipídeos..g.', 'Carboidrato..g.', 
'Fibra.Alimentar..g.', 'Cálcio..mg.', 'Ferro..mg.', 'Sódio..mg.', 'Potássio..mg.', 
'Magnésio..mg.', 'Fósforo..mg.', 'Tiamina..mg.', 'Riboflavina..mg.', 'Niacina..mg.', 
'Piridoxina..mg.', 'Vitamina.C..mg.']"""

colunas_baixo_nulos = [
    "Energia..kcal.", "Lipídeos..g.", "Sódio..mg.", "Potássio..mg.", "Ferro..mg.",
    "Fósforo..mg.", "Magnésio..mg.", "Carboidrato..g.", "Proteína..g.", "Cálcio..mg.", 
    "Riboflavina..mg.", "Tiamina..mg.", "Piridoxina..mg.", "Niacina..mg."
]

#retirando valores nulls
df[colunas_baixo_nulos] = df.groupby('Categoria do alimento')[colunas_baixo_nulos].transform(
    lambda x: x.fillna(x.mean())
)

colunas_alto_nulos = ['Fibra.Alimentar..g.', 'Vitamina.C..mg.']

df[colunas_alto_nulos] = df.groupby('Categoria do alimento')[colunas_alto_nulos].transform(
    lambda x: x.fillna(x.median())
)

df[colunas_alto_nulos] = df[colunas_alto_nulos].fillna(df[colunas_alto_nulos].median())

indetificadores = df[['Descrição dos alimentos', 'Categoria do alimento']].copy()

X = df[colunas_nutricionais].values

print(X)
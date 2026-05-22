import pandas as pd
import os

 
base_path = os.path.dirname(__file__)
def carregarDados():
    df = pd.read_csv(os.path.join(base_path, './data/alimentos.csv'))

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

    # Filtra alimentos crus na categoria de carnes
    is_carne = df['Categoria do alimento'] == 'Carnes e derivados'
    descricao_lower = df['Descrição dos alimentos'].str.lower()
    is_cru = descricao_lower.str.endswith(('cru', 'crua', 'cruas', 'cruo', 'cruos'))
    df = df[~(is_carne & is_cru)].reset_index(drop=True)

    indetificadores = df[['Descrição dos alimentos', 'Categoria do alimento']].copy()

    X = df[colunas_nutricionais].to_numpy(dtype=float)

    return df, colunas_nutricionais, X

def getCaloriasporAlimento(df, nome_alimento):
    from busca_textual import preparar_dataframe, buscar_alimento

    df_preparado = preparar_dataframe(df.copy())
    resultados = buscar_alimento(df_preparado, nome_alimento, top_n=1)

    if not resultados or resultados[0]['score'] == 0:
        raise ValueError(f"Alimento '{nome_alimento}' nao encontrado")

    indice = resultados[0]['indice']
    calorias = df.iloc[indice]['Energia..kcal.']
    descricao = df.iloc[indice]['Descrição dos alimentos']
    return calorias, descricao

def calcularTempoGasto(calorias, peso_kg):
    ATIVIDADES_MET = {
        'caminhada': 3.5,
        'corrida': 8.0,
        'ciclismo': 6.0,
        'natacao': 7.0,
        'musculacao': 5.0,
    }
    resultados = {}
    for atividade, met in ATIVIDADES_MET.items():
        tempo_minutos = round((calorias / (met * peso_kg)) * 60)
        resultados[atividade] = tempo_minutos
    return resultados



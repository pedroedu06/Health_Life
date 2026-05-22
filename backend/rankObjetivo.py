GRUPOS_SIMILARES = {
    "Cereais e derivados":                  ["Cereais e derivados", "Alimentos preparados", "Outros alimentos industrializados"],
    "Verduras, hortaliças e derivados":     ["Verduras, hortaliças e derivados"],
    "Frutas e derivados":                   ["Frutas e derivados"],
    "Gorduras e óleos":                     ["Gorduras e óleos", "Nozes e sementes"],
    "Pescados e frutos do mar":             ["Pescados e frutos do mar"],
    "Carnes e derivados":                   ["Carnes e derivados", "Alimentos preparados"],
    "Leite e derivados":                    ["Leite e derivados", "Ovos e derivados"],
    "Bebidas (alcoólicas e não alcoólicas)":["Bebidas (alcoólicas e não alcoólicas)"],
    "Ovos e derivados":                     ["Ovos e derivados", "Leite e derivados"],
    "Produtos açucarados":                  ["Produtos açucarados", "Cereais e derivados"],
    "Miscelâneas":                          ["Miscelâneas", "Alimentos preparados", "Outros alimentos industrializados"],
    "Outros alimentos industrializados":    ["Outros alimentos industrializados", "Miscelâneas", "Alimentos preparados"],
    "Alimentos preparados":                 ["Alimentos preparados", "Cereais e derivados", "Miscelâneas", "Outros alimentos industrializados"],
    "Leguminosas e derivados":              ["Leguminosas e derivados"],
    "Nozes e sementes":                     ["Nozes e sementes", "Gorduras e óleos"],
}

objetivos = {
        "menos_calorias":    ("Energia..kcal.",     "asc"),
        "mais_proteina":     ("Proteína..g.",        "desc"),
        "menos_gordura":     ("Lipídeos..g.",        "asc"),
        "menos_carboidrato": ("Carboidrato..g.",     "asc"),
        "mais_fibra":        ("Fibra.Alimentar..g.", "desc"),
        "menos_sodio":       ("Sódio..mg.",          "asc"),
        "mais_calcio":       ("Cálcio..mg.",         "desc"),
        "mais_ferro":        ("Ferro..mg.",          "desc"),
        "mais_potassio":     ("Potássio..mg.",       "desc"),
        "mais_vitamina_c":   ("Vitamina.C..mg.",     "desc"),
    }

def rankear_por_objetivo(df, indice_base, x_normalizado, similaridades, objetivo=None, pool=50, top_n=10):
    ranking_bruto = similaridades.argsort()[::-1]
    categoria_base = df.iloc[indice_base]["Categoria do alimento"]
    categorias_permitidas = GRUPOS_SIMILARES.get(categoria_base, [categoria_base])

    indices_pool = [
        inx for inx in ranking_bruto[1:pool + 1]
        if df.iloc[inx]["Categoria do alimento"] in categorias_permitidas
    ]

    if not objetivo or objetivo not in objetivos:
        # sem objetivo: retorna top_n por similaridade
        resultados = []
        for inx in indices_pool[:top_n]:
            linha = df.iloc[inx]
            resultados.append({
                "indice": int(inx),
                "nome": str(linha["Descrição dos alimentos"]),
                "similaridade": float(round(similaridades[inx], 3)),
            })
        return resultados

    coluna, ordem = objetivos[objetivo]

    # normaliza os valores nutricionais do pool entre 0 e 1
    valores = [df.iloc[inx][coluna] for inx in indices_pool]
    v_min, v_max = min(valores), max(valores)

    # Ordena o pool diretamente pelo valor nutricional do objetivo
    # desc = maior valor primeiro (mais_proteina, mais_fibra, etc.)
    # asc  = menor valor primeiro (menos_calorias, menos_gordura, etc.)
    pares = list(zip(indices_pool, valores))
    pares.sort(key=lambda x: x[1], reverse=(ordem == "desc"))

    # Pega os top_n já ordenados pelo objetivo
    top_pares = pares[:int(top_n)]

    # Recalcula min/max apenas do top para o score visual (barra de progresso)
    top_valores = [v for _, v in top_pares]

    resultados = []
    for inx, valor in top_pares:
        linha = df.iloc[inx]
        sim = similaridades[inx]

        # score_final normalizado 0-1 para a barra visual (1 = melhor)
        if v_max != v_min:
            score_nutricional = (valor - v_min) / (v_max - v_min)
            if ordem == "asc":
                score_nutricional = 1 - score_nutricional
        else:
            score_nutricional = 1.0

        resultados.append({
            "indice": int(inx),
            "nome": str(linha["Descrição dos alimentos"]),
            "similaridade": float(round(sim, 3)),
            "valor_objetivo": float(round(valor, 2)),
            "objetivo": str(objetivo),
            "score_final": float(round(score_nutricional, 3)),
        })

    return resultados
import './App.css'
import { useState, useRef, useEffect } from 'react'
import RankingList from './components/RankingList'

const OBJETIVOS: Record<string, { label: string; emoji: string; unidade: string }> = {
  menos_calorias:    { label: 'Menos Calorias',    emoji: '🔥', unidade: 'kcal' },
  mais_proteina:     { label: 'Mais Proteinas',     emoji: '💪', unidade: 'g' },
  menos_gordura:     { label: 'Menos Gorduras',     emoji: '🥗', unidade: 'g' },
  menos_carboidrato: { label: 'Menos Carboidratos', emoji: '🍞', unidade: 'g' },
  mais_fibra:        { label: 'Mais Fibras',        emoji: '🌾', unidade: 'g' },
  menos_sodio:       { label: 'Menos Sodio',        emoji: '🧂', unidade: 'mg' },
  mais_calcio:       { label: 'Mais Calcio',        emoji: '🦴', unidade: 'mg' },
  mais_ferro:        { label: 'Mais Ferro',         emoji: '🩸', unidade: 'mg' },
  mais_potassio:     { label: 'Mais Potassio',      emoji: '⚡', unidade: 'mg' },
  mais_vitamina_c:   { label: 'Mais Vitamina C',    emoji: '🍊', unidade: 'mg' },
}

interface ResultItem {
  indice: number
  nome: string
  similaridade: number
  valor_objetivo?: number
  objetivo?: string
  score_final?: number
}

interface GastoResult {
  caminhada: number
  corrida: number
  ciclismo: number
  musculacao: number
}

type UIState = 'idle' | 'loading' | 'success' | 'error' | 'empty'

function App() {
  const [alimento, setAlimento] = useState('')
  const [option, setOption] = useState('')
  const [peso, setPeso] = useState('72')
  const [resposta, setResposta] = useState<ResultItem[]>([])
  const [alimentoBase, setAlimentoBase] = useState('')
  const [uiState, setUiState] = useState<UIState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [gastoResult, setGastoResult] = useState<GastoResult | null>(null)
  const [gastoLoading, setGastoLoading] = useState(false)
  const [gastoError, setGastoError] = useState('')
  const rankingRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (uiState === 'success' && rankingRef.current) {
      setTimeout(() => {
        rankingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 150)
    }
  }, [uiState])

  const handleRankear = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!alimento.trim()) return

    setUiState('loading')
    setErrorMsg('')

    try {
      const response = await fetch('http://localhost:8000/recomendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alimento, objetivo: option }),
      })

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const data = await response.json()

      if (!data.resultados || data.resultados.length === 0) {
        setResposta([])
        setAlimentoBase(data.alimento_base || '')
        setUiState('empty')
      } else {
        setResposta(data.resultados)
        setAlimentoBase(data.alimento_base || '')
        setUiState('success')
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro desconhecido')
      setUiState('error')
    }
  }

  const handleGasto = async () => {
    if (!alimento.trim() || !peso) return

    setGastoLoading(true)
    setGastoError('')
    setGastoResult(null)

    try {
      const response = await fetch('http://localhost:8000/gastoCalorico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alimento, peso: Number.parseFloat(peso) }),
      })

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`)
      }

      const data = await response.json()
      setGastoResult(data)
    } catch (err) {
      setGastoError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setGastoLoading(false)
    }
  }

  return (
    <>
      <div className="blob-green" />
      <div className="blob-lime" />

      <div className="shell">
        {/* Top bar */}
        <header className="topbar">
          <div className="brand">
            <span className="leaf">🌿</span>
            <span className="brand-title">Health Life</span>
          </div>
          <span className="brand-tag">Descubra o que seu corpo precisa</span>
        </header>

        {/* Body: sidebar + main */}
        <div className="body">

          {/* Left sidebar */}
          <aside className="left">

            {/* Form card — Alimento + Objetivo */}
            <section className="glass-card form-card animate-fadeInUp">
              <form onSubmit={handleRankear}>
                <div className="form-group">
                  <label className="form-label" htmlFor="alimento">Alimento</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔍</span>
                    <input
                      id="alimento"
                      type="text"
                      className="input-organic input-with-icon"
                      placeholder="ex: aveia, frango, espinafre..."
                      value={alimento}
                      onChange={(e) => setAlimento(e.target.value)}
                      aria-label="Nome do alimento"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="objetivo">Objetivo nutricional</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🎯</span>
                    <select
                      id="objetivo"
                      className="select-organic input-with-icon"
                      value={option}
                      onChange={(e) => setOption(e.target.value)}
                      aria-label="Objetivo nutricional"
                    >
                      <option value="">Selecione seu objetivo...</option>
                      {Object.entries(OBJETIVOS).map(([key, { label, emoji }]) => (
                        <option key={key} value={key}>{emoji} {label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary btn-full-width"
                  disabled={uiState === 'loading' || !alimento.trim()}
                >
                  {uiState === 'loading' ? (
                    <>
                      <span className="btn-spinner" />
                      <span>Analisando...</span>
                    </>
                  ) : (
                    <>
                      <span>Analisar Nutricao</span>
                      <span>→</span>
                    </>
                  )}
                </button>

                {uiState === 'error' && (
                  <div className="error-toast">{errorMsg}</div>
                )}
              </form>
            </section>

            {/* Gasto Calorico card */}
            <section className="glass-card panel animate-fadeInUp">
              <h3 className="panel-title">Gasto calorico</h3>

              <div className="panel-form-group">
                <label className="form-label" htmlFor="peso">Peso</label>
                <div className="input-unit">
                  <input
                    id="peso"
                    type="number"
                    className="input-organic input-num"
                    value={peso}
                    min={20}
                    max={300}
                    onChange={(e) => setPeso(e.target.value)}
                    aria-label="Peso em kg"
                  />
                  <span className="unit">kg</span>
                </div>
              </div>

              <button
                type="button"
                className="btn-primary btn-full-width btn-calc"
                onClick={handleGasto}
                disabled={gastoLoading || !alimento.trim() || !peso}
              >
                {gastoLoading ? (
                  <>
                    <span className="btn-spinner" />
                    <span>Calculando...</span>
                  </>
                ) : (
                  <>
                    <span>Calcular gasto energetico</span>
                    <span>→</span>
                  </>
                )}
              </button>

              {gastoError && (
                <div className="error-toast">{gastoError}</div>
              )}

              {gastoResult && (
                <div className="activity-result">
                  <p className="activity-hint">
                    Tempo para queimar as calorias de <strong>{alimento}</strong>
                  </p>
                  <div className="activity-grid">
                    <div className="activity-card">
                      <span className="act-emoji">🚶</span>
                      <div className="act-info">
                        <span className="act-label">Caminhada</span>
                        <div className="act-num">
                          <span className="act-value">{gastoResult.caminhada}</span>
                          <span className="act-unit">min</span>
                        </div>
                      </div>
                    </div>
                    <div className="activity-card">
                      <span className="act-emoji">🏃</span>
                      <div className="act-info">
                        <span className="act-label">Corrida</span>
                        <div className="act-num">
                          <span className="act-value">{gastoResult.corrida}</span>
                          <span className="act-unit">min</span>
                        </div>
                      </div>
                    </div>
                    <div className="activity-card">
                      <span className="act-emoji">🚴</span>
                      <div className="act-info">
                        <span className="act-label">Ciclismo</span>
                        <div className="act-num">
                          <span className="act-value">{gastoResult.ciclismo}</span>
                          <span className="act-unit">min</span>
                        </div>
                      </div>
                    </div>
                    <div className="activity-card">
                      <span className="act-emoji">🏋️</span>
                      <div className="act-info">
                        <span className="act-label">Musculacao</span>
                        <div className="act-num">
                          <span className="act-value">{gastoResult.musculacao}</span>
                          <span className="act-unit">min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

          </aside>

          {/* Main: ranking area */}
          <main className="glass-card main animate-fadeInUp">
            {uiState === 'success' && resposta.length > 0 && (
              <RankingList
                resposta={resposta}
                alimentoBase={alimentoBase}
                option={option}
                objetivos={OBJETIVOS}
                rankingRef={rankingRef}
              />
            )}

            {uiState === 'empty' && (
              <div className="empty-state">
                <div className="empty-state__icon">🍃</div>
                <p className="empty-state__text">
                  Nenhum resultado encontrado. Tente outro alimento!
                </p>
              </div>
            )}

            {uiState === 'loading' && (
              <div>
                <div className="ranking-header">
                  <p className="ranking-header-label">Carregando ranking...</p>
                </div>
                <div className="skeleton-list">
                  {[...new Array(6)].map((_, i) => (
                    <div key={i} className="glass-card skeleton-card">
                      <div className="skeleton-badge" />
                      <div className="skeleton-content">
                        <div className="skeleton-line skeleton-line--title" />
                        <div className="skeleton-line skeleton-line--bar" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uiState === 'idle' && (
              <div className="idle-placeholder">
                <div className="idle-placeholder__icon">🥗</div>
                <p className="idle-placeholder__title">Seu ranking aparecera aqui</p>
                <p className="idle-placeholder__text">
                  Insira um alimento e selecione um objetivo para comecar
                </p>
              </div>
            )}
          </main>

        </div>
      </div>
    </>
  )
}

export default App

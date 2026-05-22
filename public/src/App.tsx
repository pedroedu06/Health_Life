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
  valor_objetivo: number
  objetivo: string
  score_final: number
}

type UIState = 'idle' | 'loading' | 'success' | 'error' | 'empty'

function App() {
  const [alimento, setAlimento] = useState('')
  const [option, setOption] = useState('')
  const [resposta, setResposta] = useState<ResultItem[]>([])
  const [alimentoBase, setAlimentoBase] = useState('')
  const [uiState, setUiState] = useState<UIState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
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
    if (!alimento.trim() || !option) return

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

  return (
    <div className="app-wrapper">
      {/* Decorative background blobs */}
      <div className="blob-green" />
      <div className="blob-lime" />

      {/* Header */}
      <header className="header">
        <div className="animate-leafFloat header-leaf">🌿</div>
        <h1 className="header-title">Health Life</h1>
        <p className="header-tagline">Descubra o que seu corpo precisa</p>
        <div className="header-divider" />
      </header>

      {/* Form */}
      <main className="main-content">
        <form
          onSubmit={handleRankear}
          className="glass-card animate-fadeInUp form-card"
        >
          <div className="form-group">
            <label className="form-label">Alimento</label>
            <div className="input-wrapper">
              <span className="input-icon">🔍</span>
              <input
                type="text"
                className="input-organic input-with-icon"
                placeholder="ex: aveia, frango, espinafre..."
                value={alimento}
                onChange={(e) => setAlimento(e.target.value)}
                aria-label="Nome do alimento"
              />
            </div>
          </div>

          <div className="form-group form-group--large">
            <label className="form-label">Objetivo nutricional</label>
            <div className="input-wrapper">
              <span className="input-icon">🎯</span>
              <select
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
            disabled={uiState === 'loading' || !alimento.trim() || !option}
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

        {/* Results */}
        {uiState === 'success' && resposta.length > 0 && (
          <RankingList
            resposta={resposta}
            alimentoBase={alimentoBase}
            option={option}
            objetivos={OBJETIVOS}
            rankingRef={rankingRef}
          />
        )}

        {/* Empty state */}
        {uiState === 'empty' && (
          <div className="glass-card animate-fadeInUp empty-state">
            <div className="empty-state__icon">🍃</div>
            <p className="empty-state__text">
              Nenhum resultado encontrado. Tente outro alimento!
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {uiState === 'loading' && (
          <div className="skeleton-list">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card skeleton-card">
                <div className="skeleton-badge" />
                <div className="skeleton-content">
                  <div className="skeleton-line skeleton-line--title" />
                  <div className="skeleton-line skeleton-line--bar" />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default App

import './App.css'
import { useState, useRef, useEffect } from 'react'

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

function getBadgeStyle(position: number): React.CSSProperties {
  const colors: Record<number, { bg: string; color: string }> = {
    1: { bg: 'var(--color-gold)',   color: 'var(--color-soil)' },
    2: { bg: 'var(--color-silver)', color: 'var(--color-soil)' },
    3: { bg: 'var(--color-bronze)', color: 'var(--color-soil)' },
  }
  const c = colors[position] || { bg: 'var(--color-moss)', color: 'var(--color-sand)' }
  return {
    background: c.bg,
    color: c.color,
    width: 52,
    height: 52,
    borderRadius: 14,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-mono)',
    fontWeight: 700,
    fontSize: '0.85rem',
    lineHeight: 1.1,
    flexShrink: 0,
    boxShadow: position === 1 ? '0 0 16px rgba(212,168,71,0.35)' : undefined,
  }
}

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

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

  const scorePercent = (score: number) => Math.round(score * 100)

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative background blobs */}
      <div style={{
        position: 'absolute', top: -120, left: -80, width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(61,122,75,0.25) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: -60, right: -100, width: 350, height: 350,
        background: 'radial-gradient(circle, rgba(200,242,90,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Header */}
      <header style={{
        textAlign: 'center',
        padding: '3rem 1.5rem 2rem',
        position: 'relative',
        zIndex: 1,
        background: 'radial-gradient(ellipse at top, rgba(61,122,75,0.15) 0%, transparent 60%)',
      }}>
        <div className="animate-leafFloat" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          🌿
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: 700,
          color: 'var(--color-cream)',
          letterSpacing: '-0.02em',
          marginBottom: '0.25rem',
        }}>
          NutriRank
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: '1rem',
          color: 'var(--color-mint)',
          opacity: 0.85,
        }}>
          Descubra o que seu corpo precisa
        </p>
        <div style={{
          width: 80,
          height: 3,
          margin: '1.25rem auto 0',
          borderRadius: 2,
          background: 'linear-gradient(90deg, var(--color-sprout), var(--color-lime-glow))',
        }} />
      </header>

      {/* Form */}
      <main style={{
        maxWidth: 520,
        margin: '0 auto',
        padding: '0 1.5rem 2rem',
        position: 'relative',
        zIndex: 1,
      }}>
        <form
          onSubmit={handleRankear}
          className="glass-card animate-fadeInUp"
          style={{
            padding: '2rem',
            borderLeft: '3px solid var(--color-lime-glow)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              color: 'var(--color-sprout)',
              marginBottom: '0.5rem',
              fontWeight: 500,
            }}>
              Alimento
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-sprout)',
                pointerEvents: 'none',
                zIndex: 1,
                fontSize: '1rem',
              }}>
                🔍
              </span>
              <input
                type="text"
                className="input-organic"
                placeholder="ex: aveia, frango, espinafre..."
                value={alimento}
                onChange={(e) => setAlimento(e.target.value)}
                style={{ paddingLeft: '2.75rem' }}
                aria-label="Nome do alimento"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              color: 'var(--color-sprout)',
              marginBottom: '0.5rem',
              fontWeight: 500,
            }}>
              Objetivo nutricional
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-sprout)',
                pointerEvents: 'none',
                zIndex: 1,
                fontSize: '1rem',
              }}>
                🎯
              </span>
              <select
                className="select-organic"
                value={option}
                onChange={(e) => setOption(e.target.value)}
                style={{ paddingLeft: '2.75rem' }}
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
            className="btn-primary"
            disabled={uiState === 'loading' || !alimento.trim() || !option}
            style={{ width: '100%' }}
          >
            {uiState === 'loading' ? (
              <>
                <span style={{
                  width: 18, height: 18, border: '2.5px solid rgba(28,31,24,0.3)',
                  borderTopColor: 'var(--color-soil)', borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite', display: 'inline-block',
                }} />
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
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-input)',
              background: 'rgba(200, 60, 60, 0.12)',
              border: '1px solid rgba(200, 60, 60, 0.3)',
              color: '#e88',
              fontSize: '0.85rem',
            }}>
              {errorMsg}
            </div>
          )}
        </form>

        {/* Results section */}
        {uiState === 'success' && resposta.length > 0 && (
          <section ref={rankingRef} style={{ marginTop: '2rem', scrollMarginTop: '1rem' }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '1.25rem',
            }} className="animate-fadeInUp">
              <p style={{
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-sprout)',
                fontWeight: 500,
              }}>
                Ranking para
              </p>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                color: 'var(--color-cream)',
                marginTop: '0.25rem',
              }}>
                {alimentoBase}
                <span style={{ color: 'var(--color-sand)', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
                  {' '} — {OBJETIVOS[option]?.label}
                </span>
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {resposta.map((item, index) => {
                const position = index + 1
                const score = scorePercent(item.score_final)
                const obj = OBJETIVOS[item.objetivo]
                return (
                  <div
                    key={item.indice}
                    className="glass-card animate-rankReveal"
                    style={{
                      animationDelay: `${index * 120}ms`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.25rem',
                      cursor: 'default',
                      transition: 'border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget
                      el.style.borderColor = 'rgba(91, 169, 104, 0.5)'
                      el.style.transform = 'translateY(-2px)'
                      el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget
                      el.style.borderColor = 'rgba(90, 169, 104, 0.15)'
                      el.style.transform = 'translateY(0)'
                      el.style.boxShadow = 'var(--shadow-card)'
                    }}
                  >
                    {/* Badge */}
                    <div style={getBadgeStyle(position)}>
                      <span>#{position}</span>
                      {MEDAL[position] && <span style={{ fontSize: '0.9rem' }}>{MEDAL[position]}</span>}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: 500,
                        fontSize: '1rem',
                        color: 'var(--color-cream)',
                        marginBottom: '0.35rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {item.nome}
                      </p>

                      <div style={{
                        width: '100%',
                        height: 1,
                        background: 'var(--color-moss)',
                        marginBottom: '0.5rem',
                        opacity: 0.6,
                      }} />

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.82rem',
                        marginBottom: '0.5rem',
                      }}>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-sand)' }}>
                          {obj?.label ?? item.objetivo}:{' '}
                          <strong>{item.valor_objetivo}{obj?.unidade ?? ''}</strong>
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--color-lime-glow)',
                          fontWeight: 500,
                          animation: 'scoreCount 0.4s ease both',
                          animationDelay: `${index * 120 + 300}ms`,
                        }}>
                          Score: {score}%
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div style={{
                        width: '100%',
                        height: 4,
                        background: 'var(--color-moss)',
                        borderRadius: 'var(--radius-pill)',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${score}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, var(--color-sprout), var(--color-lime-glow))',
                          borderRadius: 'var(--radius-pill)',
                          transition: 'width 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                          animation: `barGrow 0.8s cubic-bezier(0.22, 1, 0.36, 1) both`,
                          animationDelay: `${index * 120 + 200}ms`,
                        }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Empty state */}
        {uiState === 'empty' && (
          <div className="glass-card animate-fadeInUp" style={{
            marginTop: '2rem',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🍃</div>
            <p style={{
              color: 'var(--color-mint)',
              fontSize: '0.95rem',
            }}>
              Nenhum resultado encontrado. Tente outro alimento!
            </p>
          </div>
        )}

        {/* Loading skeleton */}
        {uiState === 'loading' && (
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card" style={{
                padding: '1.25rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                animationDelay: `${i * 80}ms`,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'linear-gradient(90deg, var(--color-bark), var(--color-moss), var(--color-bark))',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s ease infinite',
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    width: '70%', height: 14, borderRadius: 6, marginBottom: 10,
                    background: 'linear-gradient(90deg, var(--color-bark), var(--color-moss), var(--color-bark))',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s ease infinite',
                    animationDelay: '0.15s',
                  }} />
                  <div style={{
                    width: '100%', height: 4, borderRadius: 4,
                    background: 'linear-gradient(90deg, var(--color-bark), var(--color-moss), var(--color-bark))',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s ease infinite',
                    animationDelay: '0.3s',
                  }} />
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

import '../App.css'

interface ResultItem {
  indice: number
  nome: string
  similaridade: number
  valor_objetivo?: number
  objetivo?: string
  score_final?: number
}

interface ObjetivoInfo {
  label: string
  emoji: string
  unidade: string
}

interface RankingListProps {
  resposta: ResultItem[]
  alimentoBase: string
  option: string
  objetivos: Record<string, ObjetivoInfo>
  rankingRef: React.RefObject<HTMLElement | null>
}

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

function getBadgeClass(position: number): string {
  if (position === 1) return 'rank-badge rank-badge--gold'
  if (position === 2) return 'rank-badge rank-badge--silver'
  if (position === 3) return 'rank-badge rank-badge--bronze'
  return 'rank-badge rank-badge--default'
}

function RankingList({ resposta, alimentoBase, option, objetivos, rankingRef }: RankingListProps) {
  const hasGoal = !!option && !!objetivos[option]

  const scorePercent = (item: ResultItem) => {
    if (hasGoal && item.score_final != null) return Math.round(item.score_final * 100)
    return Math.round(item.similaridade * 100)
  }

  return (
    <section ref={rankingRef} className="ranking-section">
      <div className="ranking-header animate-fadeInUp">
        <p className="ranking-header-label">Ranking para</p>
        <p className="ranking-header-title">
          {alimentoBase}
          {hasGoal && (
            <span className="ranking-header-goal">
              {' '} — {objetivos[option].label}
            </span>
          )}
          {!hasGoal && (
            <span className="ranking-header-goal">
              {' '} — Por similaridade
            </span>
          )}
        </p>
        <div className="ranking-divider" />
      </div>

      <div className="ranking-list">
        {resposta.map((item, index) => {
          const position = index + 1
          const score = scorePercent(item)
          const obj = item.objetivo ? objetivos[item.objetivo] : null

          return (
            <div
              key={item.indice}
              className="glass-card animate-rankReveal rank-card"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className={getBadgeClass(position)}>
                <span>#{position}</span>
                {MEDAL[position] && (
                  <span className="rank-badge__medal">{MEDAL[position]}</span>
                )}
              </div>

              <div className="rank-content">
                <p className="rank-name">{item.nome}</p>
                <div className="rank-divider" />

                <div className="rank-stats">
                  <span className="rank-value">
                    {hasGoal && item.valor_objetivo != null ? (
                      <>
                        {obj?.label ?? item.objetivo}:{' '}
                        <strong>{item.valor_objetivo}{obj?.unidade ?? ''}</strong>
                      </>
                    ) : (
                      <>
                        Similaridade:{' '}
                        <strong>{Math.round(item.similaridade * 100)}%</strong>
                      </>
                    )}
                  </span>
                  <span
                    className="rank-score"
                    style={{ animationDelay: `${index * 80 + 300}ms` }}
                  >
                    Score: {score}%
                  </span>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${score}%`,
                      animationDelay: `${index * 80 + 150}ms`,
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default RankingList

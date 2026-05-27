import { formatPoints, extractPoints } from '../utils/points'

export function renderHistory(history) {
  const section = document.createElement('section')

  const redeems = history
    .filter((task) => task.labels?.some((l) => l.title === 'reward'))
    .slice(0, 20)
    .map((task) => {
      const lines = task.description.split('\n')
      const userLine = lines[0]?.replace('Usuário: ', '').trim() || 'Desconhecido'
      const rewardLine = lines[1]?.replace('Prêmio: ', '').trim() || 'Desconhecido'
      const valueLine = lines[2]?.replace('Valor: ', '').trim() || '0 pts'
      const dateLine = lines[3]?.replace('Data: ', '').trim() || ''

      const points = extractPoints(task.labels)

      return {
        user: userLine,
        reward: rewardLine,
        points: formatPoints(points),
        date: dateLine,
      }
    })

  section.innerHTML = `
    <h2 class="section-title">✅ Histórico de Resgates</h2>
    <div class="history-list">
      ${
        redeems.length === 0
          ? '<p class="empty-state">Nenhum resgate ainda</p>'
          : redeems
              .map(
                (r) => `
            <div class="history-item">
              <div class="history-info">
                <strong>${r.user}</strong>
                <span class="history-reward">${r.reward}</span>
              </div>
              <div class="history-value">-${r.points} pts</div>
              ${r.date ? `<div class="history-date">${r.date}</div>` : ''}
            </div>
          `
              )
              .join('')
      }
    </div>
  `

  return section
}

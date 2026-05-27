import {
  formatPoints,
  calcLevel,
  calcXpProgress,
} from '../utils/points'

export function renderRanking(users) {
  const section = document.createElement('section')

  const ranking = Object.entries(users)
    .sort((a, b) => b[1].balance - a[1].balance)
    .map(([name, data], index) => {
      const medals = ['🥇', '🥈', '🥉']
      const medal = medals[index] || '⭐'
      const level = calcLevel(data.earned)
      const xpProgress = calcXpProgress(data.earned)
      const xpPercent = (xpProgress / 100) * 100

      return {
        name,
        medal,
        level,
        earned: formatPoints(data.earned),
        balance: formatPoints(data.balance),
        tasks: data.tasks.length,
        xpPercent,
      }
    })

  section.innerHTML = `
    <h2 class="section-title">Ranking</h2>
    <div class="grid">
      ${ranking
        .map(
          (user) => `
        <div class="card">
          <div class="card-header">
            <span class="medal">${user.medal}</span>
            <h3>${user.name}</h3>
          </div>
          <div class="card-body">
            <div class="stat">
              <label>Nível</label>
              <value>${user.level}</value>
            </div>
            <div class="stat">
              <label>XP Ganho</label>
              <value>${user.earned} pts</value>
            </div>
            <div class="stat">
              <label>Saldo</label>
              <value class="balance">${user.balance} pts</value>
            </div>
            <div class="stat">
              <label>Tarefas</label>
              <value>${user.tasks}</value>
            </div>
          </div>
          <div class="xp-bar">
            <div class="xp-fill" style="width: ${user.xpPercent}%"></div>
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  `

  return section
}

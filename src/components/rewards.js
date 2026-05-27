import { formatPoints } from '../utils/points'
import { parseRewardDescription } from '../utils/parser'
import { createRewardRedeem } from '../api/vikunja'

export function renderRewards(rewards, users, currentUser) {
  const section = document.createElement('section')

  const userBalance = users[currentUser]?.balance || 0

  section.innerHTML = `
    <h2 class="section-title">🎁 Loja de Prêmios</h2>
    <div class="reward-grid">
      ${rewards
        .map(
          (reward, index) => {
            const canRedeem = userBalance >= reward.points
            const link = reward.description?.split('\n')[0]?.trim() || ''

            return `
            <div class="reward-card">
              <div class="reward-placeholder">${reward.title[0].toUpperCase()}</div>
              <div class="reward-content">
                <h3>${reward.title}</h3>
                <div class="reward-footer">
                  <span class="reward-points">${formatPoints(reward.points)} pts</span>
                </div>
                <div class="reward-buttons">
                  ${link ? `<button class="btn-open" data-url="${link.replace(/"/g, '')}">Abrir Loja</button>` : ''}
                  <button
                    class="btn-redeem"
                    data-index="${index}"
                    ${!canRedeem ? 'disabled' : ''}
                  >
                    ${canRedeem ? 'Resgatar' : 'Sem saldo'}
                  </button>
                </div>
              </div>
            </div>
          `
          }
        )
        .join('')}
    </div>
  `

  section.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-open')) {
      const url = e.target.dataset.url
      if (url) window.open(url, '_blank')
    }

    if (e.target.classList.contains('btn-redeem')) {
      const index = parseInt(e.target.dataset.index)
      const reward = rewards[index]
      handleRedeem(reward, currentUser, users)
        .then(() => {
          e.target.disabled = true
          e.target.textContent = 'Resgatado!'
          window.dispatchEvent(new Event('redeemSuccess'))
        })
        .catch(() => {
          alert('Erro ao resgatar prêmio')
        })
    }
  })

  return section
}

async function handleRedeem(reward, user, users) {
  const date = new Date().toLocaleString('pt-BR')
  await createRewardRedeem(user, reward, date)
  users[user].spent += reward.points
  users[user].balance -= reward.points
}

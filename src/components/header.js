import { clearCurrentUser } from '../store/user'
import { formatPoints } from '../utils/points'

export function renderHeader(currentUser, balance) {
  const header = document.createElement('header')
  header.className = 'hero'

  header.innerHTML = `
    <div class="hero-content">
      <div>
        <h1>🏆 Casa XP</h1>
        <p>Sistema doméstico de tarefas e recompensas</p>
      </div>
      <div class="user-badge">
        <span>👤 ${currentUser}</span>
        <span class="balance">Saldo: ${formatPoints(balance)} pts</span>
        <button class="btn-switch" id="switchUserBtn">Trocar</button>
      </div>
    </div>
  `

  header
    .querySelector('#switchUserBtn')
    ?.addEventListener('click', () => {
      clearCurrentUser()
      window.dispatchEvent(new Event('userSelected'))
    })

  return header
}

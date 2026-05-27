import { setCurrentUser } from '../store/user'

const userColors = [
  'hsl(200, 100%, 50%)',
  'hsl(280, 100%, 50%)',
  'hsl(20, 100%, 50%)',
  'hsl(140, 100%, 50%)',
  'hsl(40, 100%, 50%)',
]

export function renderModal(assignees) {
  const modal = document.createElement('div')
  modal.className = 'modal-overlay'
  modal.id = 'userModal'

  const uniqueUsers = [...new Set(assignees)].sort()

  modal.innerHTML = `
    <div class="modal-content">
      <h2>Quem está usando?</h2>
      <div class="user-list">
        ${uniqueUsers
          .map(
            (user, index) => `
          <button
            class="user-option"
            data-user="${user}"
            style="--user-color: ${userColors[index % userColors.length]}"
          >
            <span class="avatar">${user[0].toUpperCase()}</span>
            <span>${user}</span>
          </button>
        `
          )
          .join('')}
      </div>
    </div>
  `

  modal.addEventListener('click', (e) => {
    if (e.target.closest('.user-option')) {
      const user = e.target.closest('.user-option').dataset.user
      setCurrentUser(user)
      modal.remove()
    }
  })

  return modal
}

export function showUserModal(assignees) {
  const modal = renderModal(assignees)
  document.body.appendChild(modal)
}

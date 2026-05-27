const KEY = 'vikunja-current-user'

export function getCurrentUser() {
  return localStorage.getItem(KEY)
}

export function setCurrentUser(user) {
  localStorage.setItem(KEY, user)
  window.dispatchEvent(new Event('userSelected'))
}

export function clearCurrentUser() {
  localStorage.removeItem(KEY)
}

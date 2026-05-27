import './styles/global.css'

import { getTasks, getRewards, getRewardHistory } from './api/vikunja'
import { getCurrentUser } from './store/user'
import { extractPoints, calcBalance } from './utils/points'

import { renderHeader } from './components/header'
import { renderRanking } from './components/ranking'
import { renderRewards } from './components/rewards'
import { renderHistory } from './components/history'
import { showUserModal } from './components/modal'

let tasks = []
let users = {}
let rewards = []
let history = []
let currentUser = null

function buildUserData(tasks, historyTasks) {
  const userData = {}

  // Get all assignees
  const allAssignees = []
  tasks.forEach((task) => {
    if (task.assignees) {
      task.assignees.forEach((assignee) => {
        if (!allAssignees.includes(assignee.username)) {
          allAssignees.push(assignee.username)
        }
      })
    }
  })

  // Initialize users
  allAssignees.forEach((assignee) => {
    userData[assignee] = {
      earned: 0,
      spent: 0,
      balance: 0,
      tasks: [],
      redeems: [],
    }
  })

  // Sum earned points from tasks
  tasks.forEach((task) => {
    if (task.done && task.assignees) {
      const points = extractPoints(task.labels)
      task.assignees.forEach((assignee) => {
        if (userData[assignee.username]) {
          userData[assignee.username].earned += points
          userData[assignee.username].tasks.push({
            title: task.title,
            points,
            doneAt: task.done_at,
          })
        }
      })
    }
  })

  // Sum spent points from history
  historyTasks.forEach((task) => {
    if (task.labels?.some((l) => l.title === 'reward')) {
      const points = extractPoints(task.labels)
      const userMatch = task.description?.match(/Usuário: (.+)/)?.[1]?.trim()
      if (userMatch && userData[userMatch]) {
        userData[userMatch].spent += points
        userData[userMatch].redeems.push({
          title: task.title,
          points,
          doneAt: task.done_at,
        })
      }
    }
  })

  // Calculate balance
  Object.values(userData).forEach((user) => {
    user.balance = calcBalance(user.earned, user.spent)
  })

  return userData
}

function getAllAssignees() {
  const assignees = new Set()
  Object.keys(users).forEach((name) => assignees.add(name))
  return Array.from(assignees)
}

function showSkeleton() {
  const app = document.querySelector('#app')
  app.innerHTML = `
    <div class="container">
      <div class="skeleton" style="height: 120px; margin-bottom: 40px;"></div>
      <h2 class="section-title">Carregando...</h2>
      <div class="grid">
        ${[1, 2, 3].map(() => '<div class="skeleton"></div>').join('')}
      </div>
    </div>
  `
}

function render() {
  const app = document.querySelector('#app')

  // Check if user is selected
  if (!currentUser) {
    const assignees = getAllAssignees()
    if (assignees.length === 0) {
      app.innerHTML = '<div class="container"><p>Nenhum dado disponível</p></div>'
      return
    }
    showUserModal(assignees)
    return
  }

  app.innerHTML = ''

  // Create container wrapper
  const container = document.createElement('div')
  container.className = 'container'

  // Render header
  const userBalance = users[currentUser]?.balance || 0
  container.appendChild(renderHeader(currentUser, userBalance))

  // Render ranking
  container.appendChild(renderRanking(users))

  // Render rewards
  const rewardsWithDescription = rewards.map((reward) => ({
    ...reward,
    description: reward.description || '',
  }))
  container.appendChild(renderRewards(rewardsWithDescription, users, currentUser))

  // Render history
  container.appendChild(renderHistory(history))

  // Append container to app
  app.appendChild(container)
}

async function init() {
  try {
    showSkeleton()

    const [tasksData, rewardsData, historyData] = await Promise.all([
      getTasks(),
      getRewards(),
      getRewardHistory(),
    ])

    tasks = tasksData || []
    history = historyData || []

    users = buildUserData(tasks, history)

    rewards = (rewardsData || []).map((task) => ({
      title: task.title,
      points: extractPoints(task.labels),
      description: task.description || '',
      done: task.done,
    }))

    currentUser = getCurrentUser()

    render()

    // Listen for user changes
    window.addEventListener('userSelected', () => {
      currentUser = getCurrentUser()
      render()
    })

    // Listen for redeem success
    window.addEventListener('redeemSuccess', () => {
      init()
    })
  } catch (error) {
    console.error('Init error:', error)
    const app = document.querySelector('#app')
    app.innerHTML = `
      <div class="container">
        <p style="color: red;">Erro ao carregar dados: ${error.message}</p>
      </div>
    `
  }
}

init()

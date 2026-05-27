import './style.css'
import {
  VIKUNJA_URL,
  API_TOKEN,
  PROJECT_TASKS,
  PROJECT_REWARDS
} from './config'

const users = {}
const rewards = []

function extractPoints(labels = []) {
  for (const label of labels) {
    const match = label.title.match(/(\d+)/)

    if (match) {
      return parseInt(match[1])
    }
  }

  return 0
}

async function fetchApi(url) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  })

  return response.json()
}

async function loadTasks() {
  const tasks = await fetchApi(
    `${VIKUNJA_URL}/projects/${PROJECT_TASKS}/tasks`
  )

  const doneTasks = tasks.filter(task => task.done)

  doneTasks.forEach(task => {
    const assignee =
      task.assignees?.[0]?.username || 'Sem responsável'

    const points = extractPoints(task.labels)

    if (!users[assignee]) {
      users[assignee] = {
        points: 0,
        tasks: [],
      }
    }

    users[assignee].points += points

    users[assignee].tasks.push({
      title: task.title,
      points,
      doneAt: task.done_at,
    })
  })
}

async function loadRewards() {
  const data = await fetchApi(
    `${VIKUNJA_URL}/projects/${PROJECT_REWARDS}/tasks`
  )

  data.forEach(task => {
    rewards.push({
      title: task.title,
      points: extractPoints(task.labels),
      done: task.done,
    })
  })
}

function render() {
  const app = document.querySelector('#app')

  const ranking = Object.entries(users)
    .sort((a, b) => b[1].points - a[1].points)

  const medals = ['🥇', '🥈', '🥉']

  app.innerHTML = `
    <div class="container">

      <header class="hero">
        <h1>🏆 Casa XP</h1>
        <p>
          Sistema doméstico de tarefas e recompensas
        </p>
      </header>

      <section>
        <h2 class="section-title">Ranking</h2>

        <div class="grid">
          ${ranking.map(([name, data], index) => `
            <div class="card">
              <div class="name">
                ${medals[index] || '⭐'} ${name}
              </div>

              <div class="points">
                ${data.points}
              </div>

              <div class="subtitle">
                pontos acumulados
              </div>

              <div class="badge">
                ${data.tasks.length} tarefas concluídas
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <section>
        <h2 class="section-title">
          🎁 Loja de Prêmios
        </h2>

        <div class="reward-grid">
          ${rewards.map(reward => `
            <div class="reward-card">
              <div class="reward-title">
                ${reward.title}
              </div>

              <div class="reward-points">
                ${reward.points} pts
              </div>

              <button class="reward-button">
                Resgatar
              </button>
            </div>
          `).join('')}
        </div>
      </section>

      <section>
        <h2 class="section-title">
          ✅ Últimas tarefas concluídas
        </h2>

        <div class="task-grid">
          ${ranking.flatMap(([name, data]) =>
            data.tasks.map(task => `
              <div class="task-card">
                <strong>${task.title}</strong>

                <div class="small">
                  ${name} • +${task.points} pts
                </div>
              </div>
            `)
          ).join('')}
        </div>
      </section>

    </div>
  `
}

async function init() {
  await loadTasks()
  await loadRewards()
  render()
}

init()

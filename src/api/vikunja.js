import {
  VIKUNJA_URL,
  API_TOKEN,
  PROJECT_TASKS,
  PROJECT_REWARDS,
  PROJECT_HISTORY,
} from '../config'

async function fetchApi(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function getTasks() {
  return fetchApi(`${VIKUNJA_URL}/projects/${PROJECT_TASKS}/tasks`)
}

export async function getRewards() {
  return fetchApi(`${VIKUNJA_URL}/projects/${PROJECT_REWARDS}/tasks`)
}

export async function getRewardHistory() {
  return fetchApi(`${VIKUNJA_URL}/projects/${PROJECT_HISTORY}/tasks`)
}

export async function createRewardRedeem(user, reward, date) {
  const title = `${user} resgatou ${reward.title}`
  const description = `Usuário: ${user}\nPrêmio: ${reward.title}\nValor: ${reward.points} pts\nData: ${date}`

  return fetchApi(`${VIKUNJA_URL}/projects/${PROJECT_HISTORY}/tasks`, {
    method: 'POST',
    body: JSON.stringify({
      title,
      description,
      labels: [
        { title: `${reward.points}pts` },
        { title: 'reward' },
      ],
      done: true,
    }),
  })
}

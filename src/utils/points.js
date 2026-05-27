export function extractPoints(labels = []) {
  for (const label of labels) {
    const match = label.title.match(/(\d+(?:\.\d+)?)/)
    if (match) {
      return parseFloat(match[1])
    }
  }
  return 0
}

export function formatPoints(n) {
  return parseFloat(n.toFixed(2))
}

export function calcBalance(earned, spent) {
  return earned - spent
}

export function calcLevel(points) {
  return Math.floor(points / 100)
}

export function calcXpProgress(points) {
  return points % 100
}

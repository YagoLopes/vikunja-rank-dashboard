export function parseRewardDescription(description = '') {
  const lines = description.split('\n')

  return {
    image: lines[0]?.trim() || '',
    url: lines[1]?.trim() || '',
    description: lines.slice(2).join('\n').trim(),
  }
}

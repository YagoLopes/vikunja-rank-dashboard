import './style.css';

const VIKUNJA_URL = 'https://tasks.home710.com/api/v1';
const API_TOKEN = 'COLOQUE_SEU_TOKEN_AQUI';

const users = {};

function extractPoints(labels = []) {
  for (const label of labels) {
    const match = label.title.match(/(\d+)/);
    if (match) {
      return parseInt(match[1]);
    }
  }
  return 0;
}
async function loadTasks() {
  const response = await fetch(`${VIKUNJA_URL}/projects`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  const projects = await response.json();

  console.log(projects);
}

function render() {
  const app = document.querySelector('#app');

  const ranking = Object.entries(users).sort(
    (a, b) => b[1].points - a[1].points
  );

  app.innerHTML = `
    <div class="container">
      <h1 class="title">🏆 Ranking da Casa</h1>

      <div class="grid">
        ${ranking
          .map(
            ([name, data]) => `
          <div class="card">
            <div class="name">${name}</div>
            <div class="points">${data.points} pts</div>
            <div class="subtitle">
              ${data.tasks.length} tarefas concluídas
            </div>
          </div>
        `
          )
          .join('')}
      </div>

      <div class="task-list">
        <h2>Últimas tarefas concluídas</h2>

        ${ranking
          .flatMap(([name, data]) =>
            data.tasks.map(
              (task) => `
            <div class="task">
              <strong>${task.title}</strong>
              <div class="small">
                ${name} • +${task.points} pts
              </div>
            </div>
          `
            )
          )
          .join('')}
      </div>
    </div>
  `;
}

loadTasks();

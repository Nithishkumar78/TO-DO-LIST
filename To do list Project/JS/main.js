const form = document.getElementById('todo-form');
const input = document.querySelector('.todo-input');
const priority = document.getElementById('priority-select');
const category = document.getElementById('category-input');
const list = document.getElementById('todo-list');
const timeDisplay = document.getElementById('current-time');

function updateTime() {
  const now = new Date();
  timeDisplay.textContent = now.toLocaleString();
}

setInterval(updateTime, 1000);
updateTime();

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (task.done ? ' done' : '');

    const content = document.createElement('div');
    content.innerHTML = `
      <strong>${task.text}</strong>
      <div class="todo-meta">
        Priority: ${task.priority} | Category: ${task.category}<br>
        Created: ${task.createdAt}
        ${task.done ? `<br>Done: ${task.completedAt}` : ''}
      </div>`;

    const buttons = document.createElement('div');
    buttons.className = 'todo-buttons';

    const doneBtn = document.createElement('button');
    doneBtn.innerHTML = '✔';
    doneBtn.onclick = () => {
      task.done = !task.done;
      task.completedAt = task.done ? new Date().toLocaleString() : null;
      saveTasks();
      renderTasks();
    };

    const delBtn = document.createElement('button');
    delBtn.innerHTML = '🗑';
    delBtn.onclick = () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    };

    buttons.appendChild(doneBtn);
    buttons.appendChild(delBtn);

    li.appendChild(content);
    li.appendChild(buttons);

    list.appendChild(li);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  const priorityVal = priority.value;
  const categoryVal = category.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text,
    priority: priorityVal,
    category: categoryVal,
    done: false,
    createdAt: new Date().toLocaleString(),
    completedAt: null
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
  form.reset();
});

renderTasks();

const themes = document.querySelectorAll('.theme');

themes.forEach(theme => {
  theme.addEventListener('click', () => {
    document.body.classList.remove('light-theme', 'mid-theme', 'dark-theme');
    themes.forEach(t => t.classList.remove('active'));

    if (theme.classList.contains('light')) {
      document.body.classList.add('light-theme');
    } else if (theme.classList.contains('mid')) {
      document.body.classList.add('mid-theme');
    } else if (theme.classList.contains('dark')) {
      document.body.classList.add('dark-theme');
    }

    theme.classList.add('active');
  });
});

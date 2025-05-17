
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const prioritySelect = document.getElementById('prioritySelect');
const taskList = document.getElementById('taskList');
const searchInput = document.getElementById('searchInput');
const progressBar = document.getElementById('progressBar');
const progressPercent = document.getElementById('progressPercent');
const themeSelect = document.getElementById('themeSelect');
const sortSelect = document.getElementById('sortSelect');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  progressBar.value = percent;
  progressPercent.textContent = percent + '%';
}

function renderTasks(filteredTasks = null) {
  taskList.innerHTML = '';
  const taskArray = filteredTasks || tasks;
  taskArray.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = `task ${task.completed ? 'completed' : ''}`;
    li.style.setProperty('--priority-color', task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'green');

    const header = document.createElement('div');
    header.className = 'task-header';
    const title = document.createElement('span');
    title.textContent = task.text;
    const controls = document.createElement('div');

    const completeBtn = document.createElement('button');
    completeBtn.textContent = task.completed ? 'Undo' : 'Complete';
    completeBtn.onclick = () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
      updateProgress();
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
      updateProgress();
    };

    controls.append(completeBtn, deleteBtn);
    header.append(title, controls);

    const footer = document.createElement('div');
    footer.className = 'task-footer';
    footer.innerHTML = `<span>Due: ${task.dueDate || 'None'}</span><span>Priority: ${task.priority}</span>`;

    li.append(header, footer);
    taskList.appendChild(li);
  });
  updateProgress();
}

taskForm.onsubmit = (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = prioritySelect.value;

  if (!text) return;

  tasks.push({ text, dueDate, priority, completed: false });
  saveTasks();
  renderTasks();
  taskForm.reset();
};

searchInput.oninput = () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = tasks.filter(task => task.text.toLowerCase().includes(keyword));
  renderTasks(filtered);
};

themeSelect.onchange = () => {
  document.body.className = themeSelect.value;
};

sortSelect.onchange = () => {
  let sorted = [...tasks];
  if (sortSelect.value === 'completed') {
    sorted.sort((a, b) => b.completed - a.completed);
  } else if (sortSelect.value === 'pending') {
    sorted.sort((a, b) => a.completed - b.completed);
  } else if (sortSelect.value === 'priority') {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  } else if (sortSelect.value === 'due') {
    sorted.sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0));
  }
  renderTasks(sorted);
};

renderTasks();
themeSelect.value = document.body.className || 'light';

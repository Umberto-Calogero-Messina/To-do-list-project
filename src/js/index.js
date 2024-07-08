// El styles lo importamos aquí, ya se carga después al compilar todo
import '../scss/styles.scss';

const formElement = document.getElementById('form');
const itemLeftElement = document.getElementById('items-left');
const taskElement = document.getElementById('tasks');
const filterElements = document.querySelectorAll('[data-filter]');
const clearCompletedElement = document.getElementById('delete-completed');
const switchElement = document.getElementById('switch');
const filtersElement = document.getElementById('filters');
const bodyElement = document.body;

let tasks = [];
let currentFilter = 'all';
let darkMode = false;

const changeDarkMode = () => {
  darkMode = !darkMode;
  if (darkMode) {
    bodyElement.classList.add('dark');
    switchElement.src = './assets/images/icon-sun.svg';
  } else {
    bodyElement.classList.remove('dark');
    switchElement.src = './assets/images/icon-moon.svg';
  }
};

const formSubmitFunction = ev => {
  ev.preventDefault();
  if (ev.target.task.value === '') return;
  addNewTask(ev.target.task.value);
  ev.target.reset();
};

const addNewTask = ev => {
  const newTask = {
    id: Date.now(),
    task: ev,
    completed: false
  };
  saveNewTask(newTask);
};

const saveNewTask = task => {
  tasks.push(task);
  renderTasks();
};

const renderTasks = () => {
  taskElement.textContent = '';
  const fragment = document.createDocumentFragment();
  const filteredTasks = getFilteredTasks();

  filteredTasks.forEach(task => {
    const newTaskBox = document.createElement('div');
    newTaskBox.classList.add('task-container');

    const newTaskCheckbox = createCheckbox(task);
    const newTaskInput = createTaskLabel(task);
    const newTaskImg = createDeleteImage(task);

    newTaskBox.append(newTaskCheckbox, newTaskInput, newTaskImg);
    fragment.append(newTaskBox);

    newTaskImg.addEventListener('click', () => deleteTaskFunction(task.id));
  });

  taskElement.append(fragment);

  countTaskRemaining();
};

const createCheckbox = task => {
  const newTaskCheckbox = document.createElement('input');
  newTaskCheckbox.classList.add('task-check');
  newTaskCheckbox.id = `checkbox-${task.id}`;
  newTaskCheckbox.type = 'checkbox';
  newTaskCheckbox.checked = task.completed;
  newTaskCheckbox.addEventListener('change', () => toggleTaskCompletion(task.id));
  return newTaskCheckbox;
};

const createTaskLabel = task => {
  const newTaskInput = document.createElement('label');
  newTaskInput.classList.add('task-text');
  newTaskInput.textContent = task.task;
  newTaskInput.htmlFor = `checkbox-${task.id}`;
  return newTaskInput;
};

const createDeleteImage = task => {
  const newTaskImg = document.createElement('img');
  newTaskImg.classList.add('task-delete');
  newTaskImg.id = task.id;
  newTaskImg.src = 'assets/images/icon-cross.svg';
  return newTaskImg;
};

const toggleTaskCompletion = id => {
  tasks = tasks.map(task => {
    if (task.id === id) {
      task.completed = !task.completed;
    }
    return task;
  });
  renderTasks();
};

const deleteTaskFunction = id => {
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
};

const clearCompletedTasks = () => {
  tasks = tasks.filter(task => !task.completed);
  renderTasks();
};

const countTaskRemaining = () => {
  const itemsLeft = tasks.filter(task => !task.completed).length;

  if (tasks.length === 0) {
    itemLeftElement.textContent = 'No tasks';
  } else if (itemsLeft === 0) {
    itemLeftElement.textContent = 'All tasks completed!';
  } else {
    itemLeftElement.textContent = `${itemsLeft} items left`;
  }
};

const getFilteredTasks = () => {
  const filters = {
    active: task => !task.completed,
    completed: task => task.completed,
    all: task => currentFilter
  };

  return tasks.filter(filters[currentFilter]);
};

const handleFilterClick = event => {
  const filterElement = event.target;

  if (!filterElement.dataset.filter) return;

  document.querySelector('.filter--active').classList.remove('filter--active');
  filterElement.classList.add('filter--active');
  currentFilter = filterElement.getAttribute('data-filter');
  renderTasks();
};

countTaskRemaining();

switchElement.addEventListener('click', changeDarkMode);
clearCompletedElement.addEventListener('click', clearCompletedTasks);
formElement.addEventListener('submit', formSubmitFunction);
filtersElement.addEventListener('click', handleFilterClick);

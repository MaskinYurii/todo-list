const form = document.querySelector('#form'),
    taskInput = document.querySelector('#taskInput'),
    tasksList = document.querySelector('#tasksList'),
    emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(task => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);
// Функції
function addTask(event){
    // Скинути стандартну поведінку браузера
    event.preventDefault();

    // Дістаємо текст задачі
    const taskText = taskInput.value;

    // Створюємо об'єкт із задачею
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    }

    // Додаємо задачу у список задач
    tasks.push(newTask)

    // Сберігаємо список задач в локальне хранилище
    saveToLocalStorage();

    renderTask(newTask);

    // Очистити поле вводу та повернути на нього фокус
    taskInput.value = '';
    taskInput.focus();

    checkEmptyList();

}

function deleteTask(event){
    const target = event.target;

    // Перевіряємо, що клік був НЕ по кнопці "видалити"
    if (target.dataset.action !== 'delete') {
        return
    }

    const parentNode = target.closest('.list-group-item');

    // Знайти id задачі
    const id = Number(parentNode.id);

    // Видалення елемент з масива за допомогою фільтра
    tasks = tasks.filter(item => item.id !== id)

    // Видалити елемент
    parentNode.remove();

    // Сберігаємо список задач в локальне хранилище
    saveToLocalStorage();

    checkEmptyList();
}

function doneTask(event){
    const target = event.target;

    // Перевіряємо, що клік був НЕ по кнопці "виконано"
    if(target.dataset.action !== 'done') {
        return
    }

    const parentNode = target.closest('.list-group-item');

    // Знайти id задачі
    const id = Number(parentNode.id);

    // Знайти елемент за id
    const task = tasks.find(task => task.id === id)

    // Змінити значення done
    task.done = !task.done

    // Отримати елемент із заголовком
    const taskTitle = parentNode.querySelector('.task-title');

    // Додати класс виконаної задачі
    taskTitle.classList.toggle('task-title--done');

    // Сберігаємо список задач в локальне хранилище
    saveToLocalStorage();
}

function checkEmptyList(){
    if (tasks.length === 0){
        const emptyListHTML = `
            <li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
            <div class="empty-list__title">ToDo list empty</div>
            </li>
        `
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }
    if (tasks.length > 0){
        const emptyListElem = document.querySelector('#emptyList');
        emptyListElem ? emptyListElem.remove() : null
    }
}

function saveToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task){
    // Створюємо CSS класс
    const cssClass = task.done ? "task-title task-title--done" : "task-title";

    // Створити розмітку для нової задачі
    const taskHTML = `
        <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
            <span class="${cssClass}">${task.text}</span>
            <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action">
                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
                </button>
                <button type="button" data-action="delete" class="btn-action">
                    <img src="./img/cross.svg" alt="Done" width="18" height="18">
                </button>
            </div>
        </li>
    `

    // Додати нову задачу до списку задач
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
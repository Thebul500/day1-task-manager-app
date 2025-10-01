import { renderTasks } from './tasks';
import { updateTask } from './tasks';

function renderTasks(tasks) {
    const taskList = document.createElement('ul');
    tasks.forEach(task => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => updateTask(task.id, !task.completed));
        li.appendChild(checkbox);
        li.textContent = task.title;
        taskList.appendChild(li);
    });
    document.getElementById('tasks').appendChild(taskList);
}

function updateTask(id, completed) {
    fetch(`/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
    }).then(() => {
        fetch('/tasks')
            .then(response => response.json())
            .then(tasks => renderTasks(tasks));
    });
}

function filterTasks(status) {
    const tasks = status === 'all' ? [] : tasks.filter(task => task.completed !== (status === 'completed'));
    document.getElementById('tasks').innerHTML = '';
    renderTasks(tasks);
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            renderTasks(tasks);
            document.getElementById('filterAll').addEventListener('click', () => filterTasks('all'));
            document.getElementById('filterActive').addEventListener('click', () => filterTasks('active'));
            document.getElementById('filterCompleted').addEventListener('click', () => filterTasks('completed'));
        });
});

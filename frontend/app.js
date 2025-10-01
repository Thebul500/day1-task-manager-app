document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    
    // Fetch tasks from server
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => renderTasks(tasks));

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
        app.appendChild(taskList);

        // Add new task
        const form = document.createElement('form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value.trim();
            if (!title) return;
            fetch('/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title })
            }).then(() => {
                form.reset();
                fetch('/tasks')
                    .then(response => response.json())
                    .then(tasks => renderTasks(tasks));
            });
        });
        const input = document.createElement('input');
        input.id = 'title';
        input.placeholder = 'New task';
        const button = document.createElement('button');
        button.textContent = 'Add Task';
        form.appendChild(input);
        form.appendChild(button);
        app.appendChild(form);
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
});

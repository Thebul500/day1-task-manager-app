const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Load tasks from JSON file
let tasks = [];
try {
    const data = fs.readFileSync(path.join(__dirname, 'tasks.json'), 'utf8');
    tasks = JSON.parse(data);
} catch (err) {
    console.error("Error reading tasks.json:", err);
}

// CRUD operations

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const { title, description } = req.body;
    if (!title) return res.status(400).send('Title is required');
    tasks.push({ id: Date.now(), title, description, completed: false });
    fs.writeFileSync(path.join(__dirname, 'tasks.json'), JSON.stringify(tasks));
    res.status(201).json(tasks[tasks.length - 1]);
});

app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const task = tasks.find(t => t.id === parseInt(id));
    if (!task) return res.status(404).send('Task not found');
    task.completed = !task.completed;
    fs.writeFileSync(path.join(__dirname, 'tasks.json'), JSON.stringify(tasks));
    res.json(task);
});

app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    tasks = tasks.filter(t => t.id !== parseInt(id));
    fs.writeFileSync(path.join(__dirname, 'tasks.json'), JSON.stringify(tasks));
    res.status(204).send();
});

// Statistics
app.get('/stats', (req, res) => {
    const completedCount = tasks.filter(task => task.completed).length;
    res.json({ totalTasks: tasks.length, completedCount });
});

const PORT = 3333;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

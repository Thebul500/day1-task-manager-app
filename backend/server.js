const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for tasks (for simplicity)
let tasks = [];

// CRUD operations

// Create a task
app.post('/tasks', (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).send('Title is required');
    tasks.push({ id: Date.now(), title, completed: false });
    res.send(tasks[tasks.length - 1]);
});

// Read all tasks
app.get('/tasks', (req, res) => {
    res.send(tasks);
});

// Update a task
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, completed } = req.body;
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
    if (taskIndex === -1) return res.status(404).send('Task not found');
    tasks[taskIndex] = { ...tasks[taskIndex], title, completed };
    res.send(tasks[taskIndex]);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(task => task.id === parseInt(id));
    if (taskIndex === -1) return res.status(404).send('Task not found');
    tasks.splice(taskIndex, 1);
    res.send({ message: 'Task deleted' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

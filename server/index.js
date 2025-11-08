const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Base de datos SQLite (archivo local)
const DB_PATH = path.join(__dirname, 'data.db');
const db = new sqlite3.Database(DB_PATH);

// Crear tabla si no existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      done INTEGER DEFAULT 0
    )
  `);
});

// 🔹 Rutas CRUD
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/tasks', (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  db.run(
    'INSERT INTO tasks (title, description) VALUES (?, ?)',
    [title, description || ''],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, title, description, done: 0 });
    }
  );
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, done } = req.body;
  db.run(
    'UPDATE tasks SET title=?, description=?, done=? WHERE id=?',
    [title, description || '', done ? 1 : 0, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, title, description, done });
    }
  );
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id=?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).end();
  });
});

// Servidor en marcha
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

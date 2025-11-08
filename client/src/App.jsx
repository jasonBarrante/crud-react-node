import React, { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editing, setEditing] = useState(null);

  // Cargar tareas al inicio
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return alert('El título es obligatorio');
    const newTask = await createTask(form);
    setTasks([newTask, ...tasks]);
    setForm({ title: '', description: '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updated = await updateTask(editing.id, editing);
    setTasks(tasks.map(t => t.id === updated.id ? updated : t));
    setEditing(null);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Seguro que quieres eliminar esta tarea?')) {
      await deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const toggleDone = async (task) => {
    const updated = await updateTask(task.id, { ...task, done: !task.done });
    setTasks(tasks.map(t => t.id === updated.id ? updated : t));
  };

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>CRUD de Tareas - React + Node</h1>

      {/* Formulario */}
      <form onSubmit={editing ? handleUpdate : handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Título"
          value={editing ? editing.title : form.title}
          onChange={e => editing
            ? setEditing({ ...editing, title: e.target.value })
            : setForm({ ...form, title: e.target.value })}
          style={{ marginRight: 10 }}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={editing ? editing.description : form.description}
          onChange={e => editing
            ? setEditing({ ...editing, description: e.target.value })
            : setForm({ ...form, description: e.target.value })}
          style={{ marginRight: 10 }}
        />
        <button type="submit">{editing ? 'Guardar cambios' : 'Agregar tarea'}</button>
        {editing && (
          <button type="button" onClick={() => setEditing(null)} style={{ marginLeft: 10 }}>
            Cancelar
          </button>
        )}
      </form>

      {/* Lista de tareas */}
      <ul>
        {tasks.map(t => (
          <li key={t.id} style={{ marginBottom: 10 }}>
            <strong
              style={{
                textDecoration: t.done ? 'line-through' : 'none',
                marginRight: 10
              }}
            >
              {t.title}
            </strong>
            <span>{t.description}</span>
            <div>
              <button onClick={() => toggleDone(t)}>
                {t.done ? 'Marcar como pendiente' : 'Marcar como hecha'}
              </button>
              <button onClick={() => setEditing(t)} style={{ marginLeft: 5 }}>
                Editar
              </button>
              <button onClick={() => handleDelete(t.id)} style={{ marginLeft: 5 }}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

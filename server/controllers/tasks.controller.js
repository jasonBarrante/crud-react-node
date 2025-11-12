import { db } from '../db/connection.js';
import { sendResponse } from '../utils/response.js';


export const getTasks = (req, res) => {;
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) return sendResponse(res, 500, false, "Error al obtener items", null, err.message);
    sendResponse(res, 200, true, "Items obtenidos correctamente", rows);
  });
}

export const createTasks = (req, res) => {
  const { title, description } = req.body;
  if (!title || !description)
    return sendResponse(res, 400, false, 'Title required');
  
  db.run("INSERT INTO tasks (title, description) VALUES (?, ?)", [title, description], function (err) {
    if (err) return sendResponse(res, 500, false, "Error al crear item", null, err.message);
    sendResponse(res, 201, true, "Item creado", { id: this.lastID, title, description, done: 0 });
  });
};

export const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, done } = req.body;
  db.run(
    'UPDATE tasks SET title=?, description=?, done=? WHERE id=?',
    [title, description || '', done ? 1 : 0, id],
    function (err) {
      if (err) return sendResponse(res, 500, false, "Error al editar el item", null, err.message);
      sendResponse(res, 200, true, "Tarea actualizada correctamente", { id, title, description, done });
    }
  );
};

export const deleteTask = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id=?', [id], function (err) {
    if (err) sendResponse(res, 500, false, "Error al eliminar la tarea", null, err.message);
    sendResponse(res, 200, true, "Tarea eliminada correctamente", { id });
  });
};
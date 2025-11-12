import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

export const getTasks = () => api.get('/tasks').then(r => r.data.data);
export const createTask = (task) => api.post('/tasks', task).then(r => r.data.data);
export const updateTask = (id, task) => api.put(`/tasks/${id}`, task).then(r => r.data.data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`).then(r => r.data.data);

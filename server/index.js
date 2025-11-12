import express from 'express';
import cors from 'cors';
import tasksRoutes from "./routes/tasks.routes.js";

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// --- Usar rutas ---
app.use("/api/tasks", tasksRoutes);


// Servidor en marcha
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

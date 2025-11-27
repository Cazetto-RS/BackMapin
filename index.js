import express from 'express';
import "dotenv/config";
import "./src/database/data.js";

import usersRoutes from './src/routes/usersRoutes.js';
import categoriesRoutes from './src/routes/categoriesRoutes.js';

const app = express();
app.use(express.json());

app.use('/users', usersRoutes);
app.use('/categories', categoriesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
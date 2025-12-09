import express from 'express';
import "dotenv/config";
import "./src/database/data.js";

import usersRoutes from './src/routes/usersRoutes.js';
import enterpriseRoutes from './src/routes/enterpriseRoutes.js';
import categoriesRoutes from './src/routes/categoriesRoutes.js';
import productsRoutes from './src/routes/productsRoutes.js';
import locationsRoutes from './src/routes/locationsRoutes.js';

const app = express();
app.use(express.json());

app.use('/users', usersRoutes);
app.use('/enterprise', enterpriseRoutes);
app.use('/categories', categoriesRoutes);
app.use('/products', productsRoutes);
app.use('/locations', locationsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
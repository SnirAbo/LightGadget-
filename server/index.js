const express = require('express');
const cors = require('cors');
const connectDB = require('./configs/db');
const usersRouter = require('./controllers/userController');
const productsRouter = require('./controllers/productController');
const categoriesRouter = require('./controllers/categoryController');
const authRouter = require('./controllers/authController');
const uploadRouter = require('./controllers/uploadController');
const orderRouter = require('./controllers/orderController');

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json(
));

app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/auth', authRouter);
app.use('/upload', uploadRouter);
app.use('/orders', orderRouter);

app.get('/', (req, res) => {
  res.send('LightGadget server is running');
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

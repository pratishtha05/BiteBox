const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const dotenv = require('dotenv');
dotenv.config();

// db connection
const dbConnection = require('./config/db');
dbConnection();

// middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routers
const adminRouter = require('./routes/admin.routes');
app.use('/admin', adminRouter);

const authRouter = require('./routes/auth.routes');
app.use('/auth', authRouter);

const userRouter = require('./routes/user.routes');
app.use('/user', userRouter);

const restaurantRouter = require('./routes/restaurant.routes');
app.use('/restaurant', restaurantRouter);

const publicRouter = require("./routes/public.routes");
app.use("/public", publicRouter);

const menuRouter = require("./routes/menu.routes");
app.use("/menu", menuRouter);

const orderRouter = require("./routes/order.routes");
app.use("/order", orderRouter);

const cartRouter = require("./routes/cart.routes");
app.use("/cart", cartRouter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000 , () => {
  console.log('Server is running on port 3000');
});
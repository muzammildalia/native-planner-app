import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDb from './config/db.js';
import authRoute from './Routes/authRoute.js';
import taskRoute from './Routes/taskRoute.js'
import notesRoute from './Routes/notesRoute.js'
import cors from 'cors';
// import path from 'path'


//config .env
dotenv.config();

//config database
connectDb();

//rest object
const app = express()

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
// app.use(express.static(path.join(__dirname, './client/build')))

//routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/tasks", taskRoute);
app.use("/api/v1/notes", notesRoute);

// app.use('*', function (req, res) {
//     res.sendFile(path.join(__dirname, "./client/build/index.html"));
// })

app.get('/', (req, res) => {
    res.send("<h1>Welcome to Tablet Planner app</h1>");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server ${process.env.DEV_MODE} Running on ${PORT}`.bgCyan.white);
})
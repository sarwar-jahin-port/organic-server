import express from 'express'; // node framework
import colors from 'colors'; // make different color text in console. So, to understand text importance.
import dotenv from 'dotenv'; // info we don't want to share public.
import morgan from 'morgan'; //it's a http middleware. Gives us extra information which helps us while debugging.
import connectDB from './config/db.js'; // info related to database connection
import authRoutes from "./routes/authRoute.js"; // all auth routers are here
import categoryRoutes from "./routes/categoryRoutes.js"; // all category routers are here
import cors from 'cors'; // Cross-Origin Resource Sharing a security feature between web browser and servers.

// configure env
dotenv.config(); // start .env

// database config
connectDB(); // connect to database

// rest object
const app = express(); // creating new instance of express

// middlewares: below use methods saying express to use these passed arguments.
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// routes
app.use("/api/v1/auth", authRoutes); // any http req starting with /api/v1/auth will be passed to authRoutes for further process.
app.use("/api/v1/category", categoryRoutes); 

// rest api
app.get("/", async(req , res) => {
    res.send("<h1>Welcome to Organic Server</h1>")
})

// PORT
const PORT = process.env.PORT || 6060;

// run listen
app.listen(PORT, () => {
    console.log(`Server running on ${process.env.DEV_MODE} mode on port: ${PORT}`.bgCyan.white)
})

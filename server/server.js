import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import garageRouter from './routes/garageRoute.js'
import serviceRouter from './routes/serviceRoute.js'
import reservationRouter from './routes/reservationRoute.js'
import carRoute from './routes/carRoute.js'
import GoRoute from './routes/GarageOwner.js'

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()


app.use(express.json())
app.use(
  cors({
    origin: "http://localhost:5173",  // your React frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



app.use('/api/user',userRouter);
app.use('/api/garage',garageRouter)
app.use('/api/service',serviceRouter)
app.use('/api/Reservation',reservationRouter)
app.use('/api/Car',carRoute)
app.use("/api/garage-owner", GoRoute);


app.get('/',(req,res)=>{
    res.send('APIs WORKING');
})

app.listen(port,()=>console.log('Server started on PORT: ' + port))
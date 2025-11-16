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
import { garageOwnerRoutes } from './routes/garageOwnerRoute.js'

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middelwares 
app.use(express.json())
app.use(cors())

// api endpoints
app.use('/api/user',userRouter);
app.use('/api/garage',garageRouter)
app.use('/api/service',serviceRouter)
app.use('/api/Reservation',reservationRouter)
app.use('/api/Car',carRoute)
app.use('/api/garageOwnerRoutes', garageOwnerRoutes)
app.get('/',(req,res)=>{
    res.send('APIs WORKING');
})

app.listen(port,()=>console.log('Server started on PORT: ' + port))
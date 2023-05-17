const express = require('express')
const userRouter = require('./app/routes/user')

const app = express()

app.use(express.json())

app.use('/user',userRouter)

app.listen(3000, ()=> console.log('listening to port 3000'))
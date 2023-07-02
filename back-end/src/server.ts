import Fastify from "fastify"
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { companyRoutes } from './Routes/routesCompany'
import { usersRoutes } from './Routes/routesUsers'
import 'dotenv/config'

const app = Fastify()

app.register(jwt,{
    secret: 'teste'
})
app.register(cors, {
    origin: true,
})

app.register(companyRoutes)
app.register(usersRoutes)


app.listen({port: 3333, /*host: '0.0.0.0'*/}).then(() => {console.log('server running...')})
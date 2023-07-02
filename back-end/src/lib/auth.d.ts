import '@fastify/jwt'

declare module '@fastify/jwt'{
    export interface FastifyJWT {
        user: {
            sub: String,
            name: String,
            imageUrl: String,
        }
    }
}
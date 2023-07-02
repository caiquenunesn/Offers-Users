import { FastifyInstance } from "fastify";
import axios from 'axios'
import { z } from 'zod'
import { prisma } from '../lib/prisma'


export async function usersRoutes(app: FastifyInstance){

    app.post('/uregister', async (req) => {
        // USER REGISTER IN THE PLATFORM USING GITHUB
        const bodySchema = z.object({
            code: z.string(),
        })

        const { code } = bodySchema.parse(req.body)

        const accessTokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',null,
            {
                params: {
                    client_id: process.env.GITHUB_CLIENT_ID,
                    client_secret: process.env.GITHUB_CLIENT_SECRET,
                    code,
                },
                headers: {
                    Accept: 'application/json',
                }
            }
        )
        
        const {  access_token } = accessTokenResponse.data

        const userGit = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
        
        
        const userForm = z.object({
            id: z.number(),
            name: z.string(),
            login: z.string(),
            avatar_url: z.string(),
        })
        
        const userInfo = userForm.parse(userGit.data)
        
        let user = await prisma.user.findUnique({
            where: {
                githubId: userInfo.id
            }
        })
        
        if(!user){
            user = await prisma.user.create({
                data: {
                    githubId: userInfo.id,
                    name: userInfo.name,
                    login: userInfo.login,
                    avatarUrl: userInfo.avatar_url,

                }
            })
        }

        const token = app.jwt.sign({
            name: user.name,
            avatar_url: user.avatarUrl,
        },{
            sub: user.id,
            expiresIn: '1 day',
        })
        return {
            token
        }
        
    })

    app.get('/uoffer/:id', async (request, replay) => {
        // LIST ONE OFFER 
        
        const idForm = z.object({
            id: z.string().uuid()
        })
        const { id } = idForm.parse(request.params)
        try{
        const listoffer = await prisma.offers.findMany({
            where: {
                id,
            },
            include: {
                offers: {
                    select: {company_name: true}
                }
            }
        })
        return replay.send(listoffer)
    }catch(e){
        return replay.status(404).send({e: 'error 404'})
    }
    
    })
    
    app.get('/uoffers', async (request, replay) => {
        // LIST ALL OFFERS
        try
        {
            return await prisma.offers.findMany({
                orderBy: {
                    createAt: 'desc'
                }
            })
            
        }catch(err){
            return replay.status(404).send()
        }
    })

    app.post('/uofferegister/:id', async (request, replay) => {
        // USER REGISTER IN THE OFFER
    await request.jwtVerify()
    const formJob = z.object({
        id: z.string().uuid(),
    })
    const { id } = formJob.parse(request.params);
    try
    {
    const insertOffer = await prisma.userOnOffers.findFirst({
        where: {
            userId: String(request.user.sub),
            offersId: id,
        }
    })
    if(!insertOffer){
        await prisma.userOnOffers.create({
            data: {
                userId: String(request.user.sub),
                offersId: id,
            }
        })

        return replay.status(201).send('registered')
    }
}catch(err){
    return replay.status(404).send('erro')
}
    return replay.status(403).send('you already registed')
    })

    app.delete('/uofferstop/:id', async (request, replay) => {
        // USER STOPPEND OFFER
        await request.jwtVerify()
        const formJob = z.object({
            id: z.string().uuid(),
        })
        try
        {
            const { id } = formJob.parse(request.params);
            const offers = await prisma.userOnOffers.findFirst({
                where: {
                    userId: String(request.user.sub),
                    offersId: id,
                }
            })
            if(offers?.userId !== request.user.sub){
                return replay.status(401).send()
            }
            await prisma.userOnOffers.delete({
                where: {
                    userId_offersId: offers,
                }
            })
                return replay.status(200).send('stopped participating')
        }catch(err){
            return replay.send({error: 'not find'})
        }
    })
}
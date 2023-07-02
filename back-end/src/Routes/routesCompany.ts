import { FastifyInstance } from "fastify"
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { saltHashPassword, validadePass } from '../Encrypt/EncryptPass'

// obter code = https://github.com/login/oauth/authorize?client_id=

export async function companyRoutes(app: FastifyInstance){
    
    app.get('/cmyoffers', async (request, replay) => {
        // LIST COMPANY OFFERS 
        await request.jwtVerify()
        const listmyoffer = await prisma.offers.findMany({
            where:{
                companyId: String(request.user.sub),
            }
        })

        return replay.send(listmyoffer)
    })

    app.get('/clistparticipants/:id', async (request, replay) => {
        const idForm = z.object({
            id: z.string(),
        })

        const { id } = idForm.parse(request.params)

        try{
        const list = await prisma.userOnOffers.findMany({
            where: {
                offersId: id,
            },
            include: {
                user: {select:{name: true, avatarUrl: true, curriculum: true}}
            }
        })

        return replay.send(list)
        }catch(e){
            replay.status(404).send({e: 'error'})
        }
    })

    app.post('/cregister', async (request, replay) => {
        // REGISTER COMPANY OFFER 
        const formSchema = z.object({
            name: z.string(),
            email: z.string(),
            cnpj: z.string(),
            password: z.string(),
        })

        const { name, email, cnpj, password } = formSchema.parse(request.body)

        let company = await prisma.company.findUnique({
            where: {
                company_email: email,
            }
        })

        if (!company) {
            const passwordHash = saltHashPassword(password)
            await prisma.company.create({
                data: {
                    company_name: name,
                    company_email: email,
                    company_cnpj: cnpj,
                    password: passwordHash.passwordHash,
                    salt: String(passwordHash.salt),
                }
            })

            return replay.status(201).send('Company Create')
        }
        return replay.status(403).send('user already exists')

    })

    app.post('/clogin', async (request, replay) => {
        // LOGIN WITH COMPANY ACCOUNT
        const formLoginSchema = z.object({
            email: z.string().email(),
            pass: z.string(),
        })

        const { email, pass } = formLoginSchema.parse(request.body)

        let companyLogin = await prisma.company.findUnique({
            where: {
                company_email: email,
            }
        })

        const infoLogin = {
            passwordHash: companyLogin?.password,
            salt: companyLogin?.salt
        }
            if(validadePass(pass, Object(infoLogin))){
                const token = app.jwt.sign({
                    name: companyLogin?.company_name,
                },{
                    sub: companyLogin?.id,
                    expiresIn: '1 day'
                })
                return replay.status(200).send({login: 'login success', token})
            }
        return replay.status(401).send({error: 'verify your user or password incorret'})

    })

    app.post('/createoffer', async (request, replay) => {
        // CREATE A COMPANY OFFER
        await request.jwtVerify()
        try
        {    
            const formOffersSchema = z.object({
                tittle: z.string(),
                description: z.string({required_error: 'obrigatorio'}),
                imageUrl: z.string().optional(),
                latitude: z.number(),
                longitude: z.number(),
                contact: z.string().optional(),
            })
    
            const { tittle, description, imageUrl, latitude, longitude, contact } = formOffersSchema.parse(request.body)
                await prisma.offers.create({
                    data: {
                        tittle,
                        description,
                        imageUrl,
                        latitude,
                        longitude,
                        contact,
                        companyId: String(request.user.sub),
                    }
                })
                return replay.status(201).send('Offer create success')
        }
        catch(e){
            return replay.status(404).send({err: 'dados incompletos'})
        }
    })

    app.delete('/cdeleteoffer/:id', async (request, replay) => {
        // DELETE COMPANY OFFER
        await request.jwtVerify()
        const deletId = z.object({
            id: z.string(),
        })
        const { id } = deletId.parse(request.params)
        try
        {
                const off = await prisma.offers.findFirstOrThrow({
                where: {
                    id,
                }
            })
            if(off.companyId !== request.user.sub){
                return replay.status(401).send()
            }
            await prisma.offers.delete({
                where: {
                    id,
                }
            })
            return replay.status(200).send({message: 'deleted success'})
        }catch(err){
            return replay.status(401).send(err)
        }
    })

    
}


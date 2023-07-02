'use client'
import React, { ChangeEvent, useState, FormEvent } from 'react';
import { setCookies } from 'cookies-next'
import { baseUrl } from '../api/lib/baseUrl';
import { useRouter } from 'next/navigation'
import { LinkGit } from '../(RoutesUsers)/(Components)/LinkGit'
import Link from 'next/link';

export default function Login(){
    const nextPage = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        pass: '',
    })
    
    function handlerInput(e: ChangeEvent<HTMLInputElement>){
        const { name, value } = e.target

        setFormData({...formData, [name]: value})
    }

    async function submit(e: FormEvent){
        e.preventDefault();
        try{
            const res = await baseUrl.post('/login', formData
            )
            setCookies('token', res.data.token, {  maxAge: 60 * 6 * 24 });
            nextPage.push('/myoffers')
        }catch(e){

        }
        
    }
    return(
        <main className="h-screen bg-zinc-950 p-6">
        <form onSubmit={submit}>
    <LinkGit />
    <div>
      <label>Email</label>
      <input name='email' onChange={handlerInput}/>
      <label>Senha</label>
      <input name='pass' onChange={handlerInput} />
      <button type="submit">Login</button>

    </div>

    </form>
    

    <Link href='/register'>Registrar-se</Link>
    </main>
    )
}
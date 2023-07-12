'use client'

import { ChangeEvent, FormEvent, useState } from "react"
import { baseUrl } from "../api/lib/baseUrl"
import { useRouter } from 'next/navigation'

export default function Register(){
  const router = useRouter()
    const [register, setRegister] = useState({
        name: '',
        email: '',
        cnpj: '',
        password: '',
      })

      function handleRegister(e: ChangeEvent<HTMLInputElement>){
        const {name, value} = e.target
        setRegister({...register, [name]: value})
      }

      async function SubRegister(e: FormEvent){
        e.preventDefault()
        try{
          await baseUrl.post('/cregister', register)
          router.push('/login')
        }catch(e){
          return console.log(e)
        }
      }

      
    return(
        <main>

        <form onSubmit={SubRegister}>
        
            <div className='p-20 px-0'>
                <label>nome</label>
                <input name='name' onChange={handleRegister}/>
                <label>email</label>
                <input name='email' onChange={handleRegister} />
                <label>cnpj</label>
                <input name='cnpj' onChange={handleRegister}/>
                <label>senha</label>
                <input name='password' onChange={handleRegister} />
                <button className='px-5' type="submit">Register</button>

            </div>

        </form>
        </main>
    )
}
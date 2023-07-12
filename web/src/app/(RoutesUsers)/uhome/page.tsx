'use client'

import { useQuery } from 'react-query'
import { baseUrl } from '../../api/lib/baseUrl'
import Link from 'next/link'
import Logout from '../(Components)/Logout'
import { Key } from 'react'

interface Datas {
    id: Key
    tittle: String
    description: String
}

export default function Home(){

    const handleList = async () => {
        const res = await baseUrl.get('/uoffers').then(res => res.data)
        return res
    }

    const { data, isLoading } = useQuery({
        queryKey: ['/uoffers'],
        queryFn: handleList
    })

    return(
        <main>
            <Logout/>
            {isLoading ? <h1>carregando</h1> : data?.map((e: Datas) => {
                return(
                    <div key={e.id}>
                        <h1>{e.tittle}</h1>
                        <h1>{e.description}</h1>
                        <Link href={`/uhome/viewoffers?id=${e.id}`}>View Offer</Link>
                    </div>
                )
            })}
        </main>
    )
}
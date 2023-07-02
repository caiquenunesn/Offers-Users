'use client'

import { baseUrl } from "../../api/lib/baseUrl"
import { useRouter } from 'next/navigation'
import { useQuery } from 'react-query'
import Link from "next/link"
import { getCookie } from "cookies-next"
interface Offer {
    id: string,
    tittle: string,
    description: string,
    imageUrl?: String
    latitude: String,
    longitude: String,
    contact?: String,
}

export default function Dashboard(){
    const offers = async () => {
        const headers = { 'Authorization': `Bearer ${getCookie('token')}` }
        const res = await baseUrl.get<Offer[]>('/myoffers',{headers}).then(res => res.data)
        return res
    }
    const { data, isLoading } = useQuery({
        queryKey: ['/myoffers'],
        queryFn: offers
    })
    return(

            <main>

                {isLoading ? <h1>Carregando</h1> : data?.map(m => {
                    return(
                        <div key={m.id}>
                            <h1>{m.tittle}</h1>
                            <p>{m.description}</p>
                            <Link href={`/myoffers/viewusers?id=${m.id}`}>Detalhes</Link>
                        </div>
                    )
                })}
            </main>
    )
    
}
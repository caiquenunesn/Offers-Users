'use client'

import { baseUrl } from '@/app/api/lib/baseUrl'
import { useSearchParams } from 'next/navigation'
import { Key } from 'react'
import { useQuery } from 'react-query'


interface Datas {
    tittle: String
    companyId: String
    contact: String
    createAt: String
    description: String
    id: Key
    imageUrl: String
    latitude: String
    longitude: String
    offers: {
        company_name: String
    }
}
export default function ViewOffers(){
    const id = useSearchParams().get('id')


    const handleRegisterInOffer = () => {

    }

    const handleOfferView = async () => {
        const res =  await baseUrl.get(`/uoffer/${id}`).then(res => res.data)
        return res
    }
    const { data, isLoading } = useQuery({
        queryKey: [`/uoffer/${id}`],
        queryFn: handleOfferView
    })
    return(
        <main>
            {isLoading ? <h1>carregando..</h1> : data.map((e: Datas) => {
                return(
                <div key={e.id}>
                    <h1>{e.offers.company_name}</h1>
                    <div>
                        <h3>{e.tittle}</h3>
                        <h3>{e.description}</h3>
                        <h3>{e.contact}</h3>
                        <div>
                            <h3>{e.latitude}</h3>
                            <h3>{e.longitude}</h3>
                        </div>
                        <h3>{e.createAt}</h3>
                    </div>
                    <button>Se Inscreverse</button>
                </div>
            )})}
        </main>
    )
}
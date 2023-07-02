'use client'

import { baseUrl } from "@/app/api/lib/baseUrl"
import { useSearchParams } from "next/navigation"
import { useQuery } from "react-query"

interface PropsDatas{
    id: String,
    tittle: String,
    description: String,
    imageUrl?: String
    latitude: String,
    longitude: String,
    createdAt: Date,
    offers: {
    company_name: String,
    company_email: String,
    contact: String,
    latitude: Number,
    longitude: Number,
    }
}

export default function View(){
    const params = useSearchParams().get('id')

    const handleGet = async () => {
        const res = await baseUrl.get<PropsDatas[]>(`/oneoffer/${params}`).then(res => res.data)
        return res
    }
    const { data, isLoading } = useQuery({
        queryKey:['oneoffer'],
        queryFn: handleGet
    })
    return (
            <div>
                
                {isLoading ? <h1>Loading.</h1> : data?.map(e => (
                    <div key={e.id}>
                        <h2>Usuarios Particando</h2>
                        <h2>{e.user.name}</h2>
                        <h2>{}</h2>
                        <button>Ver</button>
                    </div>
                ))}
            </div>
)}
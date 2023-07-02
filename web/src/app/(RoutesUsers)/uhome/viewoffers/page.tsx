'use client'

import { baseUrl } from '@/app/api/lib/baseUrl'
import { useSearchParams } from 'next/navigation'
import { useQuery } from 'react-query'

export default function ViewOffers(){
    const id = useSearchParams().get('id')

    const handleOfferView = async () => {
        const res =  await baseUrl.get(`/oneoffer/${id}`).then(res => res.data)
        return res
    }
    const { data, isLoading } = useQuery({
        queryKey: [`/oneoffer/${id}`],
        queryFn: handleOfferView
    })

    console.log(data)
    return(
        <h1>{}</h1>
    )
}
'use client'

import { queryClientOptions } from "@/app/api/lib/queryClientOptions"
import React, { ReactNode, useState } from "react"
import { QueryClient, QueryClientProvider } from "react-query"

interface Props {
    children: ReactNode,
}

export const Provider = ({children}: Props) => {
    const [queryClient] = useState(() => new QueryClient(queryClientOptions))
    return (
        <QueryClientProvider client={queryClient}>
           {children} 
        </QueryClientProvider>
    )
}
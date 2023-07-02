export const queryClientOptions = {
    defaultOptions: {
        queries :{
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 30
        }
    }
}
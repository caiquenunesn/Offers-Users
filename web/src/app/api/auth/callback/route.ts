import { NextRequest, NextResponse } from 'next/server'
import { baseUrl } from '../../lib/baseUrl'

export async function GET(request: NextRequest){
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    const res = await baseUrl.post('/uregister',{
        code,
    })

    const { token } = res.data;

    const redirectURL = new URL('/uhome', request.url)
    const CookieExpirensInSeconds=60*60*24
    return NextResponse.redirect(redirectURL, {
        headers: {
            'Set-Cookie': `token=${token}; Path=/; max-age=${CookieExpirensInSeconds}`
        }
    })
}
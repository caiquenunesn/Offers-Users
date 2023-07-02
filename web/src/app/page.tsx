import Myoffers from './(RoutesCompany)/myoffers/page'
import Login from './Login/page'
import { cookies } from 'next/headers'
export default function Home() {
  const isAuth = cookies().has('token')

  return (
    <main>

    {isAuth ? <Myoffers/> : <Login/>}
    
  </main>
  )
}
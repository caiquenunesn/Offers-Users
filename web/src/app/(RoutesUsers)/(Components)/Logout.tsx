import { deleteCookie } from 'cookies-next'

export default function Logout(){

    const handleLogout= () => {
        deleteCookie('token')
    }
    return(
        <button onClick={handleLogout}>
            Logout
        </button>
    )
}
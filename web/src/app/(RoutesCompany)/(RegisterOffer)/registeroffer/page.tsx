

export default function RegisterOffer(){

    const handle = () => {
        console.log('oi')
    }

    const SubRegister = () => {
        console.log('oi')
    }
    return(
        <main>

        <form onSubmit={SubRegister}>
        
            <div className='p-20 px-0'>
                <label>Tittle</label>
                <input name='tittle' onChange={handle}/>
                <label>Description</label>
                <input name='description' onChange={handle} />
                <label>imageUrl</label>
                <input name='imageurl' onChange={handle}/>
                <label>Lati</label>
                <input name='latitude' onChange={handle} />
                <label>Long</label>
                <input name='longitude' onChange={handle} />
                <button className='px-5' type="submit">Register</button>

            </div>

        </form>
        </main>
    )
}
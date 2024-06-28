import React from 'react'

const NavbarComponent = (props: { admin: boolean}) => {
    return (
        <nav className='bg-[#737375] flex justify-between'>
            <img className="w-20 p-4" src="/WA-Logo.png" alt="William's Act Logo" />
            <button type="submit" className="bg-[#DD8A3E] hover:brightness-90 p-2 my-5 mx-4 text-white text-sm font-bold tracking-wide rounded-lg" >Sign Out</button>
        </nav>
    )
}

export default NavbarComponent

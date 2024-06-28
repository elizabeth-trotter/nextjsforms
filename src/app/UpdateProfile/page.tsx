import NavbarComponent from '@/components/NavbarComponent'
import React from 'react'

const page = () => {
    return (
        <div>
            <NavbarComponent admin={false} />
            
            <main className="min-h-screen w-full bg-[#23527C] flex items-center justify-center">

                    <div className="bg-white px-6 py-4">
                        <h1 className="text-center text-[34px] text-black mb-6 robotoCondensed font-light ">Dashboard</h1>

                        <form className="openSans font-semibold">
                            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 ">

                                <div className='flex flex-col relative'>

                                </div>

                                <div className='flex flex-col relative'>

                                </div>

                            </div>

                            <div className="flex justify-center mt-6 w-full flex-col">
                                <button type="submit" className="bg-[#DD8A3E] hover:brightness-90 p-4 w-full text-white text-sm font-bold tracking-wide" >Submit</button>
                                <p className=" text-red-600 text-xs text-end pt-1 openSans">* fields required</p>
                            </div>

                        </form>
                    </div>


            </main>
        </div>
    )
}

export default page

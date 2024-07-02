import Image from 'next/image'
import React from 'react'

const FooterComponent = () => {
    return (
        <div className="bg-[#737375]  py-[30px] ">
            <div className=" grid grid-cols-1 md:grid-cols-3 mx-auto md:max-w-[740px] lg:max-w-[970px] xl:max-w-[1200px]">
                <div className="text-white py-[20px] px-[15px]">
                    <p className=" mb-[20px]  robotoCondensed text-[22px]">WilliamsAct.org</p>
                    <div className="mb-[20px]">
                        <p className="text-[14px] break-words"> This web app was developed for the collection and management of the data required for the Williams Settlement. For more information on The Williams Case please visit </p>
                        <a className="  break-words  text-[14px]" href="https://www.cde.ca.gov/eo/ce/wc/wmslawsuit.asp" target="_blank"> https://www.cde.ca.gov/eo/ce/wc/wmslawsuit.asp.</a>
                    </div>

                    <p className="text-[14px]">Copyright © 2017-2024 WilliamsAct.org. All rights reserved. Powered by .NET Core 7.0.10</p>
                </div>

                <div className="  py-[20px] border-r border-l border-[#9c9c9c] text-white px-[15px]">
                    <div>
                        <p className=" mb-[20px] robotoCondensed text-[22px]">Follow Us On</p>
                        <div className="flex gap-x-1 mb-[10px]">
                            <a href="https://www.facebook.com/CodeStackSJ"><Image width={30} height={30} className="rounded-md" alt="Facebook" src="/FacebookLogo.png" /></a>
                            <a href="https://x.com/CodeStackSJ"><Image width={30} height={30} className="rounded-md" alt="Twitter" src="/TwitterLogo.webp" /></a>
                            <a href="https://www.instagram.com/CodeStackSJ"><Image width={30} height={30} className="rounded-md" alt="Instagram" src="/InstagramLogo.png" /></a>
                            <a href="https://www.youtube.com/CodeStackSJ"><Image width={30} height={30} className="rounded-md" alt="YouTube" src="/YouTubeLogo.png" /></a>
                        </div>
                        <a href="https://www.codestack.org/" target='_blank'><Image width={150} height={43} className="my-[5px]" src="/CodeStackFooter.png" alt="CodeStack Logo" /></a>
                        <a href="https://www.sjcoe.org/" target='_blank'><Image width={150} height={42} className=" my-[5px]" src="/SjcoeLogo.png" alt="SJCOE Logo" /></a>
                    </div>
                </div>

                <div className="  py-[20px] text-white px-[15px]">
                    <p className=" mb-[20px] robotoCondensed text-[22px]">CodeStack Sites</p>
                    <a href="https://codestack.org/" target='_blank' className='flex flex-row hover:underline'><Image width={24} height={24} className='mr-[10px]' src="/icon_codestack.png" alt="CodeStack Logo" />CodeStack</a>
                    <a href="https://seis.org/" target='_blank' className='flex flex-row hover:underline'><Image width={24} height={24} className='mr-[10px]' src="/icon_seis.png" alt="SEIS Logo" />SEIS</a>
                    <a href="https://edjoin.org/" target='_blank' className='flex flex-row hover:underline'><Image width={24} height={24} className='mr-[10px]' src="/icon_edjoin.png" alt="EDJOIN Logo" />EDJOIN</a>
                    <a href="https://mypromis.org/" target='_blank' className='flex flex-row hover:underline'><Image width={24} height={24} className='mr-[10px]' src="/icon_promis.png" alt="PROMIS Logo" />PROMIS</a>
                    <a href="https://sstonline.org/" target='_blank' className='flex flex-row hover:underline'><Image width={24} height={24} className='mr-[10px]' src="/icon_sst.png" alt="Beyond SST Logo" />Beyond SST</a>
                </div>
            </div>
        </div>
    )
}

export default FooterComponent

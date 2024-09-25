import React from 'react'
import keyboarding from './../assets/keyboard.jpg'
import newspaper from './../assets/newpaper.jpg'
import instiimg from './../assets/insti1.png'
function Mainpage() {
    return (
        <>
            <div className='bg-[#F9F4ED]'>
                <div className='flex flex-col md:flex-row w-full h-full p-5 md:p-10'>
                    <div className='w-full md:w-1/2 flex flex-col mb-6 md:mb-0'>
                        <div className='bg-[#2A2A2A] rounded-[20px] h-full p-6 mb-4'>
                            <div className='text-[28px] md:text-[35px] lg:text-[50px] font-[Metro Sans] font-bold text-[#F9F4ED] text-start'>
                                Scouring
                                <br />
                                For The
                                <br />
                                Scoop
                            </div>
                            <div className='mt-4 text-[16px] md:text-[20px] text-[#FFFFFF] font-thin'>
                                Our cosmic insight scours the realms of information, bringing you the latest scoops that are practically written in the stars.
                            </div>
                        </div>
                        <div className='flex flex-row h-[100px] md:h-[120px]'>
                            <img src={newspaper} className='w-3/4 rounded-md mr-2' alt="Newspaper" />
                            <div className='bg-[#AF695C] w-1/4 ml-2 rounded-md'></div>
                        </div>
                    </div>

                    <div className='hidden md:flex w-full md:w-1/2 rounded-[20px] justify-center overflow-hidden ml-0 md:ml-6'>
                        <img src={keyboarding} alt="Keyboarding" className='rounded-[20px] w-full scale-[1.1]' />
                    </div>
                </div>
            </div>

            <div className='bg-[#2A2A2A]'>
                <div className='flex flex-col md:flex-row w-full h-full p-5 md:p-10'>
                    <div className='w-full md:w-1/2 h-[300px] md:h-[680px] p-6 overflow-hidden rounded-[20px] bg-[#F9F4ED] mb-6 md:mb-0'>
                        <img src={instiimg} className='h-full  scale-[2.8] md:scale-[1.8] translate-y-12' alt="Institute" />
                    </div>
                    <div className='w-full md:w-1/2 flex flex-col pl-0 md:pl-5'>
                        <div className='bg-[#2A2A2A] p-4 mb-4 rounded-2xl border border-white shadow-2xl'>
                            <div className='text-[30px] md:text-[40px] lg:text-[60px] font-bold text-[#F9F4ED]'>
                                <span>ABOUT</span><br />
                                <span className='text-[#AF695C]'>US</span>
                            </div>
                        </div>
                        <div className='bg-[#2A2A2A] p-4 h-full rounded-2xl border border-white shadow-2xl'>
                            <div className='pt-3 pb-3'>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="flex-none fill-current text-[#F9F4ED] bg-black rounded-full font-bold h-8 w-8">
                                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-.001 5.75c.69 0 1.251.56 1.251 1.25s-.561 1.25-1.251 1.25-1.249-.56-1.249-1.25.559-1.25 1.249-1.25zm2.001 12.25h-4v-1c.484-.179 1-.201 1-.735v-4.467c0-.534-.516-.618-1-.797v-1h3v6.265c0 .535.517.558 1 .735v.999z" />
                                </svg>
                            </div>
                            <div className='text-[12px] md:text-[15px] lg:text-[20px] text-[#F9F4ED] font-thin'>
                                <p>Our cosmic insight scours the realms of information, bringing you the latest scoops that are practically written in the stars. Our cosmic insight scours the realms of information, bringing you the latest scoops that are practically written in the stars. Trust us to unravel the mysteries of institution happenings with a touch of oracle-like wisdom and a knack for revealing the most compelling stories in the cosmos of campus life.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center px-5 py-10 bg-gray-50 min-h-screen">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold">
                        MEET YOUR <span className="text-red-400">CHIEF EDITOR</span>
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row justify-between max-w-5xl w-full gap-8">
                    <div className="flex-1 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                        <div className="text-2xl mb-4">✏️</div>
                        <p className="text-gray-700 leading-relaxed text-justify">
                            Our cosmic insight scours the realms of information, bringing you
                            the latest scoops that are practically written in the stars. Our
                            cosmic insight scours the realms of information, bringing you the
                            latest scoops that are practically written in the stars. Trust us to
                            unravel the mysteries of institution happenings with a touch of
                            oracle-like wisdom and a knack for revealing the most compelling
                            stories in the cosmos of campus life.
                        </p>
                    </div>

                    <div className="flex-1 bg-gray-300 rounded-lg shadow-lg h-72"></div>
                </div>
            </div>
        </>
    )
}

export default Mainpage
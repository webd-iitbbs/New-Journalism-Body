import React from 'react'
import keyboarding from './../assets/keyboard.jpg'
import newspaper from './../assets/newpaper.jpg'
import instiimg from './../assets/insti1.png'
import chiefeditor from './../assets/CE1.JPG'
function Mainpage() {
    return (
        <>
            <div className='max-w-full overflow-clip bg-[#F9F4ED]'>
                <div className='flex flex-col md:flex-row w-full p-5 md:p-10'>
                    <div className='w-full md:w-1/2 flex flex-col mb-6 md:mb-0'>
                        <div className='bg-[#2A2A2A] rounded-[20px] p-6 mb-4'>
                            <div className='text-[28px] md:text-[35px] lg:text-[64px] font-[Metro Sans] font-bold text-[#F9F4ED] text-start'>
                                Scouring
                                <br />
                                For The
                                <br />
                                Scoop
                            </div>
                            <div className='mt-4 text-[16px] md:text-[20px] text-[#FFFFFF] font-thin'>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.


                            </div>
                        </div>
                        <div className='flex flex-row h-[100px] md:h-[160px]'>
                            <img src={newspaper} className="w-3/4 rounded-md mr-2" alt="Newspaper" />
                            <div className="w-1/4 bg-[#AF695C] flex items-center justify-center rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40 text-white transform -rotate-45" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a1 1 0 01-.707-.293l-7-7a1 1 0 011.414-1.414L9 14.586V2a1 1 0 112 0v12.586l5.293-5.293a1 1 0 011.414 1.414l-7 7A1 1 0 0110 18z" clipRule="evenodd" />
                                </svg>
                            </div>

                        </div>
                    </div>

                    <div className='hidden md:flex w-full md:w-1/2 rounded-[20px] justify-center overflow-hidden ml-0 md:ml-6 bg-red-300'>
                        {/* <img src={keyboarding} alt="Keyboarding" className='rounded-[20px] w-full h-min ' /> */}
                        <div>Image</div>
                    </div>
                </div>
            </div>

            <div className='bg-[#2A2A2A]' id="aboutus">
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
            <div className="flex flex-col items-center px-5 py-10 bg-gray-50 min-h-screen ">
                <div className="text-center mb-4 md:mb-8">
                    <h1 className="text-3xl lg:text-6xl font-bold">
                        MEET YOUR <span className="text-red-400">CHIEF EDITOR</span>
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row justify-between w-full md:gap-8">
                    <div className="w-full lg:w-1/2 flex-1 bg-white p-4  order-2 lg:p-6 rounded-lg shadow-lg border border-gray-200  ">
                        <div className="text-2xl mb-4">
                            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <mask id="mask0_154_251" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="46" height="46">
                                    <rect width="46" height="46" fill="#D9D9D9" />
                                </mask>
                                <g mask="url(#mask0_154_251)">
                                    <path d="M3.8335 46V36.8479H42.1668V46H3.8335ZM7.571 33.0146V24.6292L28.7022 3.45C29.1495 3.00278 29.6366 2.67535 30.1637 2.46771C30.6908 2.26007 31.2418 2.15625 31.8168 2.15625C32.3918 2.15625 32.9588 2.26007 33.5179 2.46771C34.0769 2.67535 34.58 3.00278 35.0272 3.45L37.0877 5.41458C37.5349 5.86181 37.8703 6.37292 38.0939 6.94792C38.3175 7.52292 38.4293 8.09792 38.4293 8.67292C38.4293 9.24792 38.3255 9.80694 38.1179 10.35C37.9102 10.8931 37.5828 11.3882 37.1356 11.8354L15.9564 33.0146H7.571ZM30.6668 11.8354L33.8293 8.67292L31.9127 6.70833L28.7022 9.91875L30.6668 11.8354Z" fill="#1C1B1F" />
                                </g>
                            </svg>
                        </div>

                        <p className="text-gray-700 leading-relaxed text-justify text-sm md:text-[20px]">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.

                            Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum.

                            Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti.
                        </p>
                    </div>
                    <div className="w-full lg:w-1/2 flex items-center justify-center order-1 lg:order-2">
                        <img
                            src={chiefeditor}
                            alt="ce"
                            className="w-3/4 mb-2 h-full object-cover brightness-125 drop-shadow-2xl rounded-lg grayscale saturate-50 backdrop-blur-xl filter backdrop-invert backdrop-opacity-100 lg:w-full"
                        />
                    </div>

                </div>
            </div>

        </>
    )
}

export default Mainpage
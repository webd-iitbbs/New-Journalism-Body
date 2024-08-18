// import React from 'react'
// import { FaChevronRight } from "react-icons/fa"
// const Articles = () => {
//     return (
//         <div className='w-full h-full'>

//             <div className='p-4 md:px-20 text-6xl font-black border-y-2 border-black-400 ' style={{ fontFamily: 'monospace' }}>Articles</div>
//             <div className=' p-4 md:px-20  flex flex-col md:flex-row gap-8'>
//                 <div className='w-96'>
//                     <div className='max-w-80  px-2 pl-4 bg-[#F8D082] rounded-lg'>
//                         <div className='text-2xl py-4 border-b-2 border-black flex flex-row justify-stretch align-stretch'><div>Recently Viewed </div><FaChevronRight /></div>
//                         <div className='text-2xl py-4 border-b-2 border-black'>Most Viewed</div>

//                         <div className='text-2xl py-4 border-b-2 border-black'>Trending Viewed</div>

//                         <div className='text-2xl py-4 '>Categories Viewed</div>
//                     </div>
//                 </div>

//                 <div className=' bg-blue-200 w-full lg:max-w-[800px] flex flex-row justify-center flex-wrap md:p-12 gap-8  md:gap-12 pt-0' style={{ paddingTop: '0px' }}>
//                     <div className='w-60 md:w-80  h-60 md:h-80  bg-red-200 rounded-lg'></div>
//                     <div className='w-60 md:w-80  h-60 md:h-80  bg-red-200 rounded-lg'></div>
//                     <div className='w-60 md:w-80  h-60 md:h-80  bg-red-200 rounded-lg'></div>
//                     <div className='w-60 md:w-80  h-60 md:h-80  bg-red-200 rounded-lg'></div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Articles
import React from 'react';
import { FaChevronRight } from "react-icons/fa";

const Articles = () => {
    return (
        <div className='w-full h-full'>
            <div className='p-4 md:px-20 text-6xl font-black border-y-2 border-black' style={{ fontFamily: 'monospace' }}>
                Articles
            </div>
            <div className='p-4   md:px-20 flex flex-col md:flex-row gap-8'>
                <div className='w-full md:w-1/3 max-md:max-w-[400px]'>
                    <div className='bg-[#F8D082] rounded-lg p-4'>
                        <div className='text-2xl py-4 border-b-2 border-black flex justify-between items-center'>
                            <span>Recently Viewed</span>
                            <FaChevronRight />
                        </div>
                        <div className='text-2xl py-4 border-b-2 border-black'>Most Viewed</div>
                        <div className='text-2xl py-4 border-b-2 border-black'>Trending Viewed</div>
                        <div className='text-2xl py-4'>Categories Viewed</div>
                    </div>
                </div>
                <div className='w-full md:flex-1 bg-blue-200 flex flex-wrap justify-center gap-8 md:gap-12 p-4 md:p-12' style={{ paddingTop: '0px' }}>
                    <div className='w-60 md:w-80 h-60 md:h-80 bg-red-200 rounded-lg'></div>
                    <div className='w-60 md:w-80 h-60 md:h-80 bg-red-200 rounded-lg'></div>
                    <div className='w-60 md:w-80 h-60 md:h-80 bg-red-200 rounded-lg'></div>
                    <div className='w-60 md:w-80 h-60 md:h-80 bg-red-200 rounded-lg'></div>
                </div>
            </div>
        </div>
    );
};

export default Articles;

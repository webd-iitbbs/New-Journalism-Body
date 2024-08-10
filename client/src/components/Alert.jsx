import React from 'react'

const Alert = () => {
    return (
        <div className='w-96 flex flex-col rounded-lg bg-red-600 p-2'>
            <div className="font-bold"> This is an alert</div>
            <div className="">Helper text </div>

            <div className='w-full relative'>
                <button className="bg-red-500 text-white px-2 py-1 rounded-lg w-16 absolute right-0 bottom-2">Close</button>
            </div>
        </div>
    )
}

export default Alert;
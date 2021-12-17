import React from 'react'
import RingLoader from "react-spinners/RingLoader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'

const PickingWinnerContent = () => {
  return (
    <div className='h-full w-full flex flex-col justify-center items-center' >
      <div className='relative flex justify-center items-center' >
        <FontAwesomeIcon icon={faTrophy} className='absolute text-4xl text-yellow-400' />
        <RingLoader color={'#2563eb'} size={200} speedMultiplier={0.5} />
      </div>
      <p className='mt-10 text-lg text-gray-900' >Winner is currently being chosen...</p>

    </div>
  )
}

export default PickingWinnerContent

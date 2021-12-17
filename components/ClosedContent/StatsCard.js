import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { faUserTie } from '@fortawesome/free-solid-svg-icons'


const StatsCard = ({ players, ether }) => {
  return (
    <div className='absolute top-8 right-8 w-40 p-5 flex flex-col bg-white shadow rounded-md' >
      <p className='mb-2 text-center' >Lottery Stats</p>
      <hr />
      <div className='flex items-center mt-2' >
        <FontAwesomeIcon icon={faUserTie} className='mr-1 text-sm text-gray-900' />
        <p className='text-gray-900' >Players: {players}</p>
      </div>
      <div className='flex items-center mt-2' >
        <FontAwesomeIcon icon={faEthereum} className='mr-1 text-sm text-blue-600' />
        <p className='text-gray-900' >Ether: {ether}</p>
      </div>
    </div>
  )
}

export default StatsCard

import React from 'react'

const StatsCard = ({ players, ether }) => {
  return (
    <div className='absolute top-5 right-5 p-5 flex flex-col items-center bg-white shadow' >
      <p>Lottery Stats</p>
      <p className='mt-2' >Players: {players}</p>
      <p className='mt-1' >Ether: {ether}</p>
    </div>
  )
}

export default StatsCard

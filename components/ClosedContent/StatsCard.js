import React from 'react'

const StatsCard = () => {
  return (
    <div className='absolute top-5 right-5 p-5 flex flex-col items-center bg-white shadow' >
      <p>Lottery Stats</p>
      <p className='mt-2' >Players: 2</p>
      <p className='mt-1' >Ether: 10</p>
    </div>
  )
}

export default StatsCard

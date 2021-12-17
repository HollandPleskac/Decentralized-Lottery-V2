import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'
import StatsCard from './StatsCard'
import StartLotteryBtn from './StartLotteryBtn'

const ClosedContent = () => {
  return (
    <div className='relative h-full w-full flex flex-col justify-center items-center' >
      <h3 className='py-2 px-3 mb-5 bg-blue-500 text-white rounded' >0x69e80e2cB38A2cF2BA5381bA6a8Fcf84a6249e8E</h3>
      <FontAwesomeIcon icon={faTrophy} className='text-9xl text-yellow-400' />
      <p className='mt-5 text-gray-900' >Congradulations to 0x56...72dK<br />for being chosen as the winner!</p>
      <p className='mt-2' >They won 10 Ether</p>
      <StartLotteryBtn />
      <StatsCard />
    </div>
  )
}






export default ClosedContent

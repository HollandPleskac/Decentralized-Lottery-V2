import React, { useContext } from 'react'
import ContractContext from '../../context/contractContext'

const StartLotteryBtn = () => {
  const contractCtx = useContext(ContractContext)
  const startLotteryHandler = async () => {
    await contractCtx.startLottery()
  }

  return (
    <button
      onClick={startLotteryHandler}
      className='px-2 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition ease-in duration-100'
    >
      Start Lottery
    </button>
  )
}


export default StartLotteryBtn

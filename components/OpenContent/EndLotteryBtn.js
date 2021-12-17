import React, { useContext } from 'react'
import ContractContext from '../../context/contractContext'

const EndLotteryBtn = () => {
  const contractCtx = useContext(ContractContext)
  const endLotteryHandler = async () => {
    await contractCtx.endLottery()
  }

  return (
    <button
      onClick={endLotteryHandler}
      className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition ease-in duration-100'
    >
      End Lottery
    </button>
  )
}
export default EndLotteryBtn

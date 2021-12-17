import React, { useState, useContext } from 'react'
import ContractContext from '../../context/contractContext'
import EtherInput from './EtherInput'
import EnterLotteryBtn from './EnterLotteryBtn'
import EndLotteryBtn from './EndLotteryBtn'

const OpenContent = () => {
  const contractCtx = useContext(ContractContext)

  const totalEther = contractCtx.totalEther
  const players = contractCtx.players

  // local state
  const [enteredEther, setEnteredEther] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)

  const enterLotteryHandler = async () => {
    if (isNaN(enteredEther)) {
      setFeedback('Ether entered must be a number!')
      return
    }

    setLoading(true)
    try {
      await contractCtx.enterLottery(enteredEther)
      setFeedback('')
    } catch (e) {
      setFeedback(e.message)
    }
    setEnteredEther('')
    setLoading(false)
  }

  const enteredEtherChangeHandler = (e) => {
    setEnteredEther(e.target.value)
  }

  return (
    <div className='h-full w-full flex justify-center items-center' >
      <div >
        <p className='text-gray-600 text-sm mb-2' >&nbsp;</p>
        <h1 className='text-5xl text-blue-600 ' >Want to try your luck?</h1>
        <p className='mt-4 text-center text-gray-600' >{players} people entered, competing to win {totalEther} ether</p>
        <div className='flex items-center mt-10' >
          <EtherInput value={enteredEther} changeHandler={enteredEtherChangeHandler} loading={loading} />
          <EnterLotteryBtn enterLotteryFn={enterLotteryHandler} loading={loading} />
        </div>
        {
          feedback === ''
            ? <p className='text-gray-600 text-center text-sm mt-2' >&nbsp;</p>
            : <p className='text-gray-600 text-center text-sm mt-2' >{feedback}</p>
        }
        <div className='text-center mt-2' >
          <EndLotteryBtn />
        </div>
      </div>
    </div>
  )
}

export default OpenContent

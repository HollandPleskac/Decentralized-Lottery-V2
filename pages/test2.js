import React, { useState, useContext } from 'react'
// import ClipLoader from "react-spinners/ClipLoader";
import ConnectionContext from '../context/connectionContext'
import Header from '../components/Header'
import EnterLotteryBtn from '../components/EnterLotteryBtn'
import EtherInput from '../components/EtherInput'

const HomePage = () => {
  const ctx = useContext(ConnectionContext)

  // local state
  const [enteredEther, setEnteredEther] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)

  // contract state
  const [players, setPlayers] = useState(null)
  const [totalEther, setTotalEther] = useState(null)


  const enterLotteryHandler = async () => {

    if (isNaN(enteredEther)) {
      setFeedback('Ether entered must be a number!')
      return
    }

    setLoading(true)
    try {
      // call enter lottery
      console.log("entering lottery")
      setFeedback('')
    } catch (e) {
      setFeedback(e.message.replace('MetaMask Tx Signature: ', '').replace('.', ''))
    }
    setEnteredEther('')
    setLoading(false)
  }

  const enteredEtherChangeHandler = (e) => {
    setEnteredEther(e.target.value)
  }

  return (
    <div>
      <Header />
      <p className='text-gray-600 text-sm mb-2' >&nbsp;</p>
      <h1 className='text-5xl text-blue-600 ' >Want to try your luck?</h1>
      <p className='mt-4 text-gray-600' >{(players && players.length) || 0} people entered, competing to win {totalEther || 0} ether</p>
      <div className='flex items-center mt-10' >
        <EtherInput value={enteredEther} changeHandler={enteredEtherChangeHandler} loading={loading} />
        <EnterLotteryBtn enterLottery={enterLotteryHandler} loading={loading} />
      </div>
      {
        feedback === ''
          ? <p className='text-gray-600 text-sm mt-2' >&nbsp;</p>
          : <p className='text-gray-600 text-sm mt-2' >{feedback}</p>
      }
    </div>
  )
}


export default HomePage

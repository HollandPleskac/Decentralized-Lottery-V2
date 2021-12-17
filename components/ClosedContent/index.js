import React, { useState, useContext } from 'react'
import ContractContext from '../../context/contractContext'
import ClipLoader from "react-spinners/ClipLoader";
import PropagateLoader from "react-spinners/PropagateLoader";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrophy } from '@fortawesome/free-solid-svg-icons'

import StatsCard from './StatsCard'
import StartLotteryBtn from './StartLotteryBtn'

const ClosedContent = () => {
  const contractCtx = useContext(ContractContext)

  const [lastWinnerAddress, setLastWinnerAddress] = useState()
  const [etherWon, setEtherWon] = useState()
  const [playersInLastLottery, setPlayersInLastLottery] = useState()

  useState(() => {
    const setData = async () => {
      const lastWinnerData = await contractCtx.getLastWinnerData()
      setLastWinnerAddress(lastWinnerData.lastWinner)
      setEtherWon(lastWinnerData.etherWon)
      setPlayersInLastLottery(lastWinnerData.players)
      console.log(lastWinnerData)
      console.log('last winner data above')
    }

    setData()
  })

  const formatAddress = (fullAddress) => {
    const firstPart = fullAddress.substr(0, 4)
    const lastPart = fullAddress.substr(fullAddress.length - 4)
    return `${firstPart}...${lastPart}`
  }

  // loading
  if (lastWinnerAddress === undefined || etherWon === undefined || playersInLastLottery === undefined) {
    return (
      <div className='h-full w-full flex justify-center items-center' >
        <ClipLoader color={'#2563eb'} size={23} />
      </div>
    )
  }

  // lottery has never been started before
  if (lastWinnerAddress === '0x0000000000000000000000000000000000000000' && etherWon === '0.0' && playersInLastLottery === 0) {
    return (
      <div className='h-full w-full flex flex-col justify-center items-center' >
        <StartLotteryBtn />
        <p className='mb-2 mt-2 text-gray-900' >There is no previous winner data to display</p>
        <p className='mb-4' >Wait for the owner to start the lottery</p>
        <PropagateLoader color="#2563eb" />
      </div>
    )
  }

  // lottery ended
  return (
    <div className='relative h-full w-full flex flex-col justify-center items-center' >
      <h3 className='py-2 px-3 mb-5 bg-blue-500 text-white rounded' >{lastWinnerAddress}</h3>
      <FontAwesomeIcon icon={faTrophy} className='text-9xl text-yellow-400' />
      <p className='mt-5 text-gray-900' >Congradulations to {formatAddress(lastWinnerAddress)}<br />for being chosen as the winner!</p>
      <p className='mt-2 mb-2' >{etherWon} Ether was won</p>
      <StartLotteryBtn />
      <StatsCard players={playersInLastLottery} ether={etherWon} />
    </div>
  )
}






export default ClosedContent

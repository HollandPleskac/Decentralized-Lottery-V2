import React, { useContext } from 'react'
import { ethers } from 'ethers'
import ContractContext from '../context/contractContext'
import MetaMaskBtn from '../components/MetaMaskBtn'

const HomePage = () => {
  const contractCtx = useContext(ContractContext)

  const startHandler = async () => {
    await contractCtx.startLottery()
  }

  const enterHandler = async () => {
    await contractCtx.enterLottery()

  }

  const endHandler = async () => {
    await contractCtx.endLottery()

  }


  return (
    <div className="h-screen flex flex-col justify-center items-center" >
      <MetaMaskBtn />
      <ActionComp fn={startHandler} name="start" />
      <ActionComp fn={enterHandler} name="enter" />
      <ActionComp fn={endHandler} name="end" />

    </div>
  )
}

const ActionComp = ({ fn, name }) => {
  return (
    <button onClick={fn} >{name}</button>

  )
}


export default HomePage

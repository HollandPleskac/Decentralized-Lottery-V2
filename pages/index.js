import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { ethers } from 'ethers'

import ConnectionContext from '../context/connectionContext'
import MetaMaskBtn from '../components/MetaMaskBtn'

const url = 'http://localhost:3000/'

const HomePage = () => {
  const [Lottery, setLottery] = useState(null)
  const [lotteryAddress, setLotteryAddress] = useState(null)

  useEffect(() => {
    async function setContractData() {
      const contract = await axios.get(`${url}Lottery.json`).then(res => res.data)  // axios.get returns an http response obj, res.data = HackathonFactory contract
      const address = await axios.get(`${url}LotteryAddress.json`).then(res => res.data.address)
      setLottery(contract)
      setLotteryAddress(address)
      console.log('addr', address)
      console.log("contract", contract)
    }
    setContractData()
  }, [])

  const startAndPickWinner = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    const lottery = new ethers.Contract(lotteryAddress, Lottery.abi, signer)

    

  }

  const getRandomNumber = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const lottery = new ethers.Contract(lotteryAddress, Lottery.abi, provider)

    const result = await lottery.randomResult()
    console.log("random result: ", result);
  }


  const connectionCtx = useContext(ConnectionContext)
  return (
    <div className="h-screen flex flex-col justify-center items-center" >
      <MetaMaskBtn connection={connectionCtx.connection} />
      <button onClick={startAndPickWinner} >Start and Pick Winner</button>
      <button onClick={getRandomNumber} >Get Random Number</button>
    </div>
  )
}

export default HomePage

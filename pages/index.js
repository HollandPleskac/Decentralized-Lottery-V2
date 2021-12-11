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

  useEffect(() => {
    if (Lottery !== null && lotteryAddress !== null) {
      console.log("listing for events", lotteryAddress)
      const filter = {
        address: lotteryAddress,
        topics: [
          // the name of the event, parnetheses containing the data type of each event, no spaces
          ethers.utils.id("PickingWinner(bytes32)")
        ]
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      provider.on(filter, () => {
        console.log("picking winner event fired!")
      })
    }
  }, [Lottery, lotteryAddress])

  const startAndPickWinner = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner();
    const lottery = new ethers.Contract(lotteryAddress, Lottery.abi, signer)

    const startTx = await lottery.startLottery()
    await startTx.wait()
    console.log("started lottery")

    // Enter participants
    const options = { value: ethers.utils.parseEther("0.05") }
    const enterLotteryAcc1Tx = await lottery.enterLottery(options)
    console.log("entered into lottery")

    const endTx = await lottery.endLottery()
    await endTx.wait()
    // console.log("ended the lottery")
  }

  const getRandomNumber = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const lottery = new ethers.Contract(lotteryAddress, Lottery.abi, provider)

    const result = await lottery.randomResult()
    console.log("random result: ", result);

    const lastWiner = await lottery.lastWinner()
    console.log("last winner", lastWiner)
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

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ethers } from 'ethers'

const url = 'http://localhost:3000/'
// const url = 'https://{INSERT_PROJECT}.vercel.app/'
// const decimals = ethers.BigNumber.from(10).pow(18)

const ContractContext = React.createContext({
  Contract: null,
  contractAddress: null,
  contractState: null,
  players: null,
  totalEther: null,
  startLottery: async () => { },
  enterLottery: async () => { },
  endLottery: async () => { },
  getLastWinnerData: async () => { }
})

export const ContractContextProvider = (props) => {

  const [Contract, setContract] = useState() // capital Contract refers to the compiled contract (not the abi)
  const [contractAddress, setContractAddress] = useState()

  // contract state
  const [contractState, setContractState] = useState('LOADING')
  const [players, setPlayers] = useState()
  const [totalEther, setTotalEther] = useState()

  // --- Initial State --- //

  useEffect(() => {
    const setContractData = async () => {
      try {
        const contract = await axios.get(`${url}Lottery.json`).then(res => res.data)  // axios.get returns an http response obj, res.data = Lottery contract
        const address = await axios.get(`${url}LotteryAddress.json`).then(res => res.data.address)
        setContract(contract)
        setContractAddress(address)
        console.log('set contract data')
        setPlayers(await getPlayerCount(contract, address))
        setTotalEther(await getContractBalance(address))
        setContractState(await getContractState(contract, address))
      } catch (e) {
        console.log('err', e)
      }
    }

    setContractData()
  }, [])


  // --- Events --- //

  useEffect(() => {
    if (contractAddress && Contract) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const lottery = new ethers.Contract(contractAddress, Contract.abi, provider)
      console.log("listing for events at ", contractAddress)

      const stateChangeEvent = {
        address: contractAddress,
        topics: [
          // the name of the event, parnetheses containing the data type of each event, no spaces
          ethers.utils.id("StateChange(string)")
        ]
      }

      const playerEnteredEvent = {
        address: contractAddress,
        topics: [
          ethers.utils.id("PlayerEntered()")
        ]
      }

      lottery.on(stateChangeEvent, (state) => {
        console.log("state change event fired! new state:", state)
        setContractState(state)
      })

      lottery.on(playerEnteredEvent, () => {
        console.log("new player entered the lottery",)
        setPlayers(prevState => prevState++)
      })

      return (() => {
        provider.off()
      })
    }
  }, [contractAddress, Contract])


  // --- Lottery Functions --- //

  const startLottery = async () => {
    console.log("--- startLottery called from contractContext testsf ---")
    console.log("another start?")
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const lottery = new ethers.Contract(contractAddress, Contract.abi, signer)
    try {
      const startLotteryTx = await lottery.startLottery()
      await startLotteryTx.wait()
    } catch (e) {
      console.log('error starting the lottery', e)
    }
  }

  const enterLottery = async (enteredEther) => {
    console.log("--- enterLottery called from contractContext ---")
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const lottery = new ethers.Contract(contractAddress, Contract.abi, signer)
    try {
      const parsedEther = ethers.utils.parseEther(enteredEther.toString())
      const options = { value: ethers.BigNumber.from(parsedEther) }
      const enterLotteryAcc1Tx = await lottery.enterLottery(options)
      await enterLotteryAcc1Tx.wait()
      console.log("entered tx", enterLotteryAcc1Tx)
      setTotalEther(await getContractBalance(contractAddress))
    } catch (e) {
      console.log('error entering the lottery', e)
      throw e
    }
  }

  const endLottery = async () => {
    console.log("--- endLottery called from contractContext ---")
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const lottery = new ethers.Contract(contractAddress, Contract.abi, signer)
    try {
      const endLotteryAcc1Tx = await lottery.endLottery()
      await endLotteryAcc1Tx.wait()
      setTotalEther(0)
      setPlayers(0)
    } catch (e) {
      console.log('error ending the lottery', e)
    }
  }

  const getLastWinnerData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const lottery = new ethers.Contract(contractAddress, Contract.abi, provider)
    const lastWinnerData = await lottery.lastWinnerData()
    console.log("last winner is ", lastWinnerData.lastWinner)
    return ({
      lastWinner: lastWinnerData.lastWinner,
      etherWon: ethers.utils.formatEther(lastWinnerData.etherWonByLastWinner),
      players: lastWinnerData.playersInLastLottery.toNumber()
    })
  }

  // --- Internal Functions (only used in this context) --- //

  const getContractBalance = async (contractAddr) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const balance = await provider.getBalance(contractAddr);
    console.log("total eth", ethers.utils.formatEther(balance))
    return ethers.utils.formatEther(balance);
  }

  const getContractState = async (Contract, contractAddress) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const lottery = new ethers.Contract(contractAddress, Contract.abi, provider)
    let contractState = await lottery.state()
    console.log("got contract state of (0 OPEN, 1 CLOSED, 2 PICKING_WINNER)", contractState)
    switch (contractState) {
      case 0: return 'OPEN'
      case 1: return 'CLOSED'
      case 2: return 'PICKING_WINNER'
    }
  }

  const getPlayerCount = async (Contract, contractAddress) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const lottery = new ethers.Contract(contractAddress, Contract.abi, provider)
    const playerCount = await lottery.getParticipantsLength()
    console.log("getPlayerCount ", playerCount.toNumber())
    return playerCount.toNumber()
  }


  return (
    <ContractContext.Provider value={{
      Contract,
      contractAddress,
      contractState,
      players,
      totalEther,
      startLottery,
      enterLottery,
      endLottery,
      getLastWinnerData
    }} >
      {props.children}
    </ContractContext.Provider>
  )

}

export default ContractContext
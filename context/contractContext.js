import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ethers } from 'ethers'

const url = 'http://localhost:3000/'
// const url = 'https://{INSERT_PROJECT}.vercel.app/'
// const decimals = ethers.BigNumber.from(10).pow(18)

const ContractContext = React.createContext({
  Contract: null,
  contractAddress: null,
  startLottery: async () => { },
  enterLottery: async () => { },
  endLottery: async () => { }
})

export const ContractContextProvider = (props) => {

  const [Contract, setContract] = useState() // capital Contract refers to the compiled contract (not the abi)
  const [contractAddress, setContractAddress] = useState()

  // contract state
  const [contractState, setContractState] = useState('')
  const [players, setPlayers] = useState(null)
  const [totalEther, setTotalEther] = useState(null)

  // state
  // players in lottery
  // total ether to be won

  useEffect(() => {
    const setContractData = async () => {
      try {
        const contract = await axios.get(`${url}Lottery.json`).then(res => res.data)  // axios.get returns an http response obj, res.data = Lottery contract
        const address = await axios.get(`${url}LotteryAddress.json`).then(res => res.data.address)
        setContract(contract)
        setContractAddress(address)

        console.log('set contract data')
      } catch (e) {
        console.log('err', e)
      }
    }

    setContractData()
  }, [])


  useEffect(() => {
    if (contractAddress) {
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

      lottery.on(stateChangeEvent, (state) => {
        console.log("state change event fired! nefw state:", state)
      })

      return (() => {
        provider.off(stateChangeEvent)
      })
    }
  }, [contractAddress, Contract.abi])




  const startLottery = async () => {
    console.log("--- startLottery called from contractContext testsf ---")
    console.log("another start?")
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const lottery = new ethers.Contract(contractAddress, Contract.abi, signer)
    try {
      // const startLotteryTx = await lottery.startLottery()
      // await startLotteryTx.wait()
      const emitTx = await lottery.emitEvent()
      await emitTx.wait()
    } catch (e) {
      console.log('error starting the lottery', e)
    }
  }

  const enterLottery = async () => {
    console.log("--- enterLottery called from contractContext ---")
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const lottery = new ethers.Contract(contractAddress, Contract.abi, signer)
    try {
      const options = { value: ethers.utils.parseEther("0.15") }
      const enterLotteryAcc1Tx = await lottery.enterLottery(options)
      await enterLotteryAcc1Tx.wait()
    } catch (e) {
      console.log('error entering the lottery', e)
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
    } catch (e) {
      console.log('error ending the lottery', e)
    }
  }


  return (
    <ContractContext.Provider value={{
      Contract,
      contractAddress,
      startLottery,
      enterLottery,
      endLottery
    }} >
      {props.children}
    </ContractContext.Provider>
  )

}

export default ContractContext
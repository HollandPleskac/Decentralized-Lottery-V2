import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ethers } from 'ethers'

const url = 'http://localhost:3000/'
// const url = 'https://{INSERT_PROJECT}.vercel.app/'
// const decimals = ethers.BigNumber.from(10).pow(18)

const ContractContext = React.createContext({
  Contract: null,
  contractAddress: null,
})

export const ContractContextProvider = (props) => {

  const [Contract, setContract] = useState() // capital Contract refers to the compiled contract (not the abi)
  const [contractAddress, setContractAddress] = useState()
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

    // useEffect
    // listen for events from the contract
    // *add state for the events

    // functions
    // start lottery
    // enter lottery
    // end lottery

    setContractData()
  }, [])






  return (
    <ContractContext.Provider value={{
      Contract,
      contractAddress,
    }} >
      {props.children}
    </ContractContext.Provider>
  )

}

export default ContractContext
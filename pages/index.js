import React, { useContext } from 'react'
import { ethers } from 'ethers'
import ContractContext from '../context/contractContext'
import MetaMaskBtn from '../components/MetaMaskBtn'

const HomePage = () => {
  return (
    <div className="h-screen flex flex-col justify-center items-center" >
      <MetaMaskBtn />
    </div>
  )
}

export default HomePage

import React, { useState, useContext } from 'react'
import { ethers } from 'ethers'
import ContractContext from '../context/contractContext'
import Header from '../components/Header'
import OpenContent from '../components/OpenContent'
import ClosedContent from '../components/ClosedContent'

const HomePage = () => {
  const contractCtx = useContext(ContractContext)
  return (
    <div className="h-screen flex flex-col items-center" >
      {/* <MetaMaskBtn /> */}
      <Header />
      {contractCtx.contractState === 'OPEN' && <OpenContent />}
      {contractCtx.contractState === 'PICKING_WINNER' && <PickingWinnerContent />}
      {contractCtx.contractState === 'CLOSED' && <ClosedContent />}
    </div>
  )
}

const PickingWinnerContent = () => {
  return (
    <div>content 3</div>
  )
}


export default HomePage

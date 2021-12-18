/*
  I decided to manager the isOwner state here. Unfortunately, the owner is located in the ContractContext.
  I import the contract context to get access to the owner variable.  Then I update the isowner variable here.
*/

import React, { useState, useEffect, useContext } from 'react'
import ContractContext from './contractContext'

const url = 'http://localhost:3000/'
// const url = 'https://{INSERT_PROJECT}.vercel.app/'

const ConnectionContext = React.createContext({
  connection: '',
  account: '',
  isOwner: false,
})

export const ConnectionContextProvider = (props) => {
  const contractCtx = useContext(ContractContext)

  const [connection, setConnection] = useState('')
  const [account, setAccount] = useState(null)
  const [isOwner, setIsOwner] = useState() // is this account the owner of the lottery contract

  const isMetaMaskInstalled = async () => {
    // if they dont have metamask 'ethereum' doesnt exist, need to use 'window.ethereum'
    if (window.ethereum && window.ethereum.isMetaMask) return true
    return false
  }

  const isMetaMaskConnected = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
    if (accounts.length !== 0) return true
    return false
  }

  useEffect(() => {
    const determineIsOwner = async (account) => {
      if (account === contractCtx.owner.toLowerCase()) // account address returned by meta mask is in all lowercase letters
        setIsOwner(true)
      else
        setIsOwner(false)
    }

    const setConnectionState = async () => {
      if (!(await isMetaMaskInstalled())) {
        setConnection('NOT INSTALLED')
        setAccount(null)
        return
      } else if (await isMetaMaskConnected()) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        setConnection('CONNECTED')
        setAccount(accounts[0])
        determineIsOwner(accounts[0])
        return
      } else {
        setConnection('DISCONNECTED')
        setAccount(null)
        return
      }
    }

    if (contractCtx.owner) {
      setConnectionState() // initial state

      const accountsChangedHandler = async function (accounts) {
        console.log('accounts changed', accounts)
        setConnectionState()
        determineIsOwner(accounts[0])
      }

      window.ethereum.on('accountsChanged', accountsChangedHandler)

      return (() => {
        window.ethereum.removeListener('accountsChanged', accountsChangedHandler)
      })
    }

  }, [contractCtx.owner])

  const contextValue = {
    connection: connection,
    account: account,
    isOwner: isOwner
  }

  return (
    <ConnectionContext.Provider value={contextValue}>
      {props.children}
    </ConnectionContext.Provider>
  )
}

export default ConnectionContext
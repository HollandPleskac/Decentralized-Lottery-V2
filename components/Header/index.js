import React, { useContext } from 'react'
import ConnectionContext from '../../context/connectionContext'
import MetaMaskBtn from '../MetaMaskBtn'
import Logo from './Logo'
import HeaderLink from './HeaderLink'

const Header = () => {
  const connectionCtx = useContext(ConnectionContext)
  return (
    <div className='z-10 w-full flex items-center shadow-md' >
      <Logo />
      <div className='flex-grow flex justify-center items-center py-4' >
        <HeaderLink name="About" href="#" />
        <HeaderLink name="Information" href="#" />
        <HeaderLink name="FAQ" href="#" />
      </div>
      <div className='w-1/4 pr-10 flex justify-end' >
        <MetaMaskBtn connection={connectionCtx.connection} />
      </div>
    </div>
  )
}


export default Header

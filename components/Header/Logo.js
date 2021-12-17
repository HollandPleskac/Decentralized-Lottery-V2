import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdjust } from '@fortawesome/free-solid-svg-icons'

const Logo = () => {
  return (
    <Link passHref href="/" >
      <a className='w-1/4 pl-10 flex items-center cursor-pointer' >
        <FontAwesomeIcon icon={faAdjust} className="text-5xl mr-4" />
        <h1 className='text-lg' >Lottery</h1>
      </a>
    </Link>
  )
}
export default Logo

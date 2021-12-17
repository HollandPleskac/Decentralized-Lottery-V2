import React from 'react'
import Link from 'next/link'

const HeaderLink = (props) => {
  return (
    <Link href={props.href}  >
      <a className="p-4 hover:bg-gray-50 transition ease-in duration-100">{props.name}</a>
    </Link>
  )
}

export default HeaderLink

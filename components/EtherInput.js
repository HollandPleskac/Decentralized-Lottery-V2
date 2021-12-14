import React from 'react'

const EtherInput = ({ loading, value, changeHandler }) => {

  const disabledClasses = 'bg-gray-50'
  const inputClasses = loading ? disabledClasses : ''

  return (
    <input
      readOnly={loading}
      type="text"
      placeholder='Amount in Ether'
      value={value}
      onChange={changeHandler}
      className={`px-4 border-2 border-gray-500 rounded-l-lg focus:outline-none focus:border-gray-600 transition ease-in duration-100 ${inputClasses}`}
      style={{ width: 400, height: 50 }}
    />
  )
}

export default EtherInput

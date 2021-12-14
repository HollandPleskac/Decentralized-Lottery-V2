import React from 'react'

const EnterLotteryBtn = ({ enterLotteryFn, loading }) => {

  const enabledClasses = 'border-blue-600 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:border-blue-700 focus:bg-blue-700 '
  const disabledClasses = 'border-gray-500 bg-gray-500 cursor-default'
  const btnClasses = loading ? disabledClasses : enabledClasses

  return (
    <button
      disabled={loading}
      onClick={enterLotteryFn}
      className={`flex items-center px-2 border-2 rounded-r-lg transition ease-in duration-100 ${btnClasses}`}
      style={{ height: 50 }}
    >
      {
        // loading ? <ClipLoader color={'#fff'} size={23} /> : 'Enter'
        loading ? <p>loading</p> : 'Enter'
      }
    </button>
  )
}

export default EnterLotteryBtn

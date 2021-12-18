import '../styles/globals.css'
import { ConnectionContextProvider } from '../context/connectionContext'
import { ContractContextProvider } from '../context/contractContext'

function MyApp({ Component, pageProps }) {
  return (
    <ContractContextProvider>
      <ConnectionContextProvider>
        <Component {...pageProps} />
      </ConnectionContextProvider >
    </ContractContextProvider>
  )
}

export default MyApp

import Head from 'next/head'
import { useProfile } from 'swrlit/hooks/things'
import { getPaymentPointer } from '../model/profile'

// mysilio's uphold USD payment pointer
const defaultPaymentPointer = "$ilp.uphold.com/DYPhbXPmDa2P"

export default function WebMonetization({webId}){
  const { profile } = useProfile(webId)
  const paymentPointer = getPaymentPointer(profile)

  return (
    <Head>
      <meta name="monetization" content={paymentPointer || defaultPaymentPointer} key="monetization" />
    </Head>
  )
}

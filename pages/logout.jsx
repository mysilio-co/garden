import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuthentication } from 'swrlit'

import { Loader } from '../components/elements'

export default function LogoutPage() {
  const { logout } = useAuthentication()
  const router = useRouter()

  useEffect(function () {
    logout()
    router.push('/')
  }, [])
  return <Loader />
}
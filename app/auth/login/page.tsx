import Login from '@/components/Login'
import React from 'react'

import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Travel Login',
  description: 'Generated Login Travel next app',
};
const LoginPage = () => {
  return (
    <div><Login/></div>
  )
}

export default LoginPage
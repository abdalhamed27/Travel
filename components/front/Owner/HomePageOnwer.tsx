import { useRouter } from 'next/navigation';
import React from 'react'

const HomePageOnwer = () => {
  const router = useRouter(); // Initialize useRouter
  router.push('/Dashboard'); // Redirect to dashboard after successful save

  return (
    <div>HomePageOnwer</div>
  )
}

export default HomePageOnwer
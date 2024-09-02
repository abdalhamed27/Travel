import TripDetails from '@/components/front/Trip/TripDetails'
import React from 'react'
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Travel Trips Details',
  description: 'Generated Trips Details Travel next app',
};
const page = () => {
  return (
    <div><TripDetails /></div>
  )
}

export default page
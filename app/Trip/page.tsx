import AllTrips from '@/components/front/Trip/AllTrips'
import React from 'react'
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Travel Trips',
  description: 'Generated Trips Travel next app',
};
const pageTrip = () => {
  return (
    <div><AllTrips /></div>
  )
}

export default pageTrip
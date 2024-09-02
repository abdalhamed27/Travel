import TripCurrent from '@/components/front/Trip/TripCurrent'
import React from 'react'
import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Travel Trips Current',
  description: 'Generated Trips Current Travel next app',
};
const pageTrip = () => {
  return (
    <div><TripCurrent/></div>
  )
}

export default pageTrip
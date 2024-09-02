import React from 'react'
import type { Metadata } from 'next';
import Profile from '@/components/front/profile/Profile';
export const metadata: Metadata = {
  title: 'Travel Profile',
  description: 'Generated Profile Travel next app', 
}; 
const ProfilePage = () => {
  return (<div style={{minHeight:'100vh',display:'flex',justifyContent:'center' }}>
    <Profile  />
    </div>)
}

export default ProfilePage
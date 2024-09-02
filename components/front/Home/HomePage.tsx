'use client';

import React, { useEffect } from 'react';
import Navbar from '../Navbar';
import ImageSlider from './ImageSlider';
import Feature from './Feature';
import { useSession } from 'next-auth/react';
import Loading from '../loading/Loading';
import { useRouter } from 'next/navigation';
import NavBarHome from './NavBarHome';

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  if ( session?.user?.role === 'owner') {
    router.push('/Dashboard');
  }
  // Show loading spinner while authentication status is being determined
  if (status === 'loading') {
    return <Loading />;
  }


    return (
      <div className='swiper-slide'>
        <div className='relative'>
          <NavBarHome   />
        </div>
        <ImageSlider />
        <Feature />
      </div>
    );
 

};

export default HomePage;

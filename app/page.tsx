import HomePage from "@/components/front/Home/HomePage";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travel Home',
  description: 'Generated  Travel next app',
};
export default function Home() {

  return (
    <>

    <HomePage />
  
    </>
    
  );
}


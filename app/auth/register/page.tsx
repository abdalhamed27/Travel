import Register from '@/components/Register';
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travel register',
  description: 'Generated register Travel next app',
};

interface PageProps {
  params: {
    lang: string;
  };
}

const Page: React.FC<PageProps> = ({ params: { lang } }) => {
  return (
    <div><Register trans={lang} /></div>
  );
}

export default Page;

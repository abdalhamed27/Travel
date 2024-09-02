import type { Metadata } from 'next';
import './globals.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


import { languages } from '../i18n/settings';
import { CustomThemeProvider } from '@/components/ThemeProvider';
import SessionWrapper from '@/components/SessionWrapper';

export const metadata: Metadata = {
  title: 'Travel',
  description: 'Generated  Travel next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  
  return (
    <html lang={'en'}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ minHeight: '100vh', background: '#9bb5c1' }} suppressHydrationWarning={true}>
        <SessionWrapper>
          <CustomThemeProvider>{children}</CustomThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}

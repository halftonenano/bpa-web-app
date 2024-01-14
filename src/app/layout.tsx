import ToasterComponent from '@/components/ToasterComponent';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LearnX',
  description:
    'LearnX Web is an innovative tutorial site made for the BPA Web Application Competition',
  metadataBase: new URL('https://learnxweb.com'),
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToasterComponent />
        {children}
      </body>
    </html>
  );
}

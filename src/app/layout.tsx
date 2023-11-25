import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ToasterComponent from '@/components/ToasterComponent';
import AccountWidget from '@/components/AccountWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LearnX',
  description: 'For BPA',
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

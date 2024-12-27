// pages/_app.tsx
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import { Session } from 'next-auth';
import '../styles/globals.css';

interface MyAppProps extends AppProps {
  session: Session | null;
}

function MyApp({ 
  Component, 
  pageProps: { session, ...pageProps }
}: MyAppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
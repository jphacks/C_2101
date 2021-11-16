import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, Spinner } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import React, { Suspense } from "react";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <div suppressHydrationWarning>
    {typeof window === "undefined" ? null : (
      <Suspense fallback={<Spinner />}>
        <ChakraProvider>
          <RecoilRoot>
            <Component {...pageProps} />
          </RecoilRoot>
        </ChakraProvider>
      </Suspense>
    )}
  </div>
);

export default MyApp;

import Head from "next/head";
import Footer from "./footer/footer";
import Header from "./header/header";
import React from "react";
import { Box } from "@chakra-ui/react";

type LayoutProps = {
  children: React.ReactNode;
  contentTitle?: string;
};

const Layout: React.FC<LayoutProps> = ({ children, contentTitle }) => {
  return (
    <>
      <Head>
        <title>LT Space | オンライン発表に特化したビデオチャット</title>
      </Head>
      <Header contentTitle={contentTitle} />
      <Box>{children}</Box>
      <Footer />
    </>
  );
};

export default Layout;

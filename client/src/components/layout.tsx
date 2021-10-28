import Head from "next/head";
import Footer from "./footer/footer";
import Header from "./header/header";
import React from "react";
import { Box, Container } from "@chakra-ui/react";

type LayoutProps = {
  children: React.ReactNode;
  contentTitle?: string;
};

const Layout: React.FC<LayoutProps> = ({ children, contentTitle }) => {
  return (
    <Container minHeight="100vh" minWidth="100vw" padding="0">
      <Head>
        <title>LT Space | オンライン発表に特化したビデオチャット</title>
      </Head>
      <Header contentTitle={contentTitle} />
      <Box>{children}</Box>
      <Footer />
    </Container>
  );
};

export default Layout;

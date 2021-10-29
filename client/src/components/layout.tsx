import Head from "next/head";
import Footer from "./footer/footer";
import Header from "./header/header";
import React from "react";
import { Box, Container, Flex } from "@chakra-ui/react";

type LayoutProps = {
  children: React.ReactNode;
  contentTitle?: string;
};

const Layout: React.FC<LayoutProps> = ({ children, contentTitle }) => {
  return (
    <Container
      minHeight="100vh"
      minWidth="100vw"
      padding="0"
      position="relative"
    >
      <Head>
        <title>LT Space | オンライン発表に特化したビデオチャット</title>
      </Head>
      <Header contentTitle={contentTitle} />
      <Box>{children}</Box>

      {/*  フッターを最下部に固定するため */}
      <Box height="50px"></Box>

      <Footer />
    </Container>
  );
};

export default Layout;

import Head from "next/head";
import Footer from "./footer/footer";
import Header from "./header/header";

export default function Layout({ children }: { children: any }) {
  return (
    <>
      <Head>
        <title>LT Space | オンライン発表に特化したビデオチャット</title>
      </Head>
      <div>
        <Header />
        <div>{children}</div>
        <Footer />
      </div>
    </>
  );
}

import React from "react";
import { Authed } from "../components/function/Authed";
import { PageExplore } from "../components/page/PageExplore";

const Explore: React.VFC = () => {
  return (
    <Authed>
      <PageExplore />
    </Authed>
  );
};

export default Explore;

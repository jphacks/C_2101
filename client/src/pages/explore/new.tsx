import React from "react";
import { Authed } from "../../components/function/Authed";
import { PageNewExplore } from "../../components/page/PageNewExplore";

const CreateSpace: React.VFC = () => {
  return (
    <Authed>
      <PageNewExplore />
    </Authed>
  );
};

export default CreateSpace;

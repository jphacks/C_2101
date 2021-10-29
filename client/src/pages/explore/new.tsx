import React from "react";
import { Authed } from "../../components/function/Authed";
import { PageCreateSpace } from "../../components/page/PageCreateSpace";

const CreateSpace: React.VFC = () => {
  return (
    <Authed>
      <PageCreateSpace />
    </Authed>
  );
};

export default CreateSpace;

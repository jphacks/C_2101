import React, { useEffect } from "react";
import { useLogin } from "../../hooks/useLogin";
import { useRouter } from "next/router";

type AuthedProps = {
  // linkTo:
};

export const Authed: React.FC = ({ children }) => {
  console.log("authed");

  const { user } = useLogin();
  const router = useRouter();

  useEffect(() => {
    console.log("effect");
    if (!user) {
      console.log("push router");
      void router.push(`/login?next=${router.asPath}`);
    }
  }, [user, router]);

  if (!user) {
    return <></>;
  }
  return <>{children}</>;
};

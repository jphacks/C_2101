import React, { useEffect } from "react";
import { useLogin } from "../../hooks/useLogin";
import { useRouter } from "next/router";

type AuthedProps = {
  // linkTo:
};

export const Authed: React.FC = ({ children }) => {
  const { user } = useLogin();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      void router.push(`/login?next=${router.asPath}`);
    }
  }, [user, router]);

  if (!user) {
    return <></>;
  }
  return <>{children}</>;
};

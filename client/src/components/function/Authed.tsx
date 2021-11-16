import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "../../lib/hooks/useUser";

type AuthedProps = {
  // linkTo:
};

export const Authed: React.FC = ({ children }) => {
  const user = useUser();
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

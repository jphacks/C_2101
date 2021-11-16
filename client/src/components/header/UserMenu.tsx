import {
  Avatar,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { AiFillSetting, AiOutlineLogout } from "react-icons/ai";
import React, { useCallback } from "react";
import { useUser } from "../../lib/hooks/useUser";
import { useLogoutAction } from "../../lib/hooks/useAuth";
import { useRouter } from "next/router";

type Props = {
  contentTitle?: string;
};

const UserMenu: React.FC<Props> = ({ contentTitle }) => {
  const user = useUser();
  const logout = useLogoutAction();
  const router = useRouter();

  const handleClickLogout = useCallback(async () => {
    await logout();
    await router.push("/");
  }, [logout, router]);

  if (!user) {
    return <Avatar size={"sm"} />;
  }

  return (
    <>
      <Menu>
        <MenuButton>
          <Avatar size={"sm"} src={user.iconUrl} />
        </MenuButton>
        <MenuList minW="0" borderRadius="0">
          <MenuItem color="#364862">
            <AiFillSetting size="20px" />
            <Text marginLeft="10px">アカウント設定</Text>
          </MenuItem>
          <MenuItem color="#364862" onClick={handleClickLogout}>
            <AiOutlineLogout size="20px" />
            <Text marginLeft="10px">ログアウト</Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export default UserMenu;

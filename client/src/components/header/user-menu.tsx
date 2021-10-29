import {
  Avatar,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { AiFillSetting, AiOutlineLogout } from "react-icons/ai";
import React from "react";
import { useLogin } from "../../hooks/useLogin";

type Props = {
  contentTitle?: string;
};

const UserMenu: React.FC<Props> = ({ contentTitle }) => {
  const { user, logout } = useLogin();

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
          <MenuItem color="#364862" onClick={logout}>
            <AiOutlineLogout size="20px" />
            <Text marginLeft="10px">ログアウト</Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export default UserMenu;

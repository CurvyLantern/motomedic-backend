import { logout } from "@/hooks/auth";
import axiosClient from "@/lib/axios";
import { User } from "@/types/defaultTypes";
import { notifications } from "@mantine/notifications";

export const fetchUser = async () => {
  const user = await axiosClient.v1.api.get("user").then<User>((res) => {
    return res.data;
  });
  if (user) {
    return user;
  } else {
    logout();
    notifications.show({
      message: JSON.stringify("Session expired"),
      color: "red",
    });
    return null;
  }
};

import axiosClient from "@/lib/axios";

export const fetchCSRF = async () => {
  // await axiosClient.base.get("sanctum/csrf-cookie");
  await axiosClient.v1.web.get("csrf").then((data) => {
    return data;
  });
};

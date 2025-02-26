import request from "@/utils/request";

export function login(username, password) {
  return request({
    url: "/admin/login",
    method: "post",
    data: {
      username,
      password,
    },
  });
}

export function fetchList(params) {
  return request({
    url: "/api/product/getProductList",
    method: "post",
    data: params,
  });
}

export function logout() {
  return request({
    url: "/admin/logout",
    method: "post",
  });
}

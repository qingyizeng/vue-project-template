import request from "@/utils/request";

export function fetchPartersList(params) {
  return request({
    url: "/api/tour/getPartners",
    method: "post",
    data: params,
  });
}

export function getAllTour(params) {
  return request({
    url: "/api/tour/getAllTour",
    method: "post",
    data: params,
  });
}

export function getEntrepreneurs() {
  return request({
    url: "/api/tour/getEntrepreneurs",
    method: "post",
  });
}

export function createAppointment(params) {
  return request({
    url: "/api/tour/createAppointment",
    method: "post",
    data: params,
  });
}

export function cancelAppointment(params) {
  return request({
    url: "/api/tour/cancelAppointment",
    method: "post",
    data: params,
  });
}

export function getAvailableTimes(partnerId,today) {
  return request({
    url: "/api/tour/getAvailableTimes",
    method: "post",
    data: {
      "partnerId":partnerId,
      "date":today
    },
  });
}

import axios, { endpoints } from "./axios"

export const apiGoogleLogin = (data) =>
  axios({
    method: "post",
    url: endpoints.auth.googleLogin,
    data,
  })
export const apiLoginWithEmail = (data) =>
  axios({
    method: "post",
    url: endpoints.auth.loginEmail,
    data,
  })
export const apiLoginWithPhone = (data) =>
  axios({
    method: "post",
    url: endpoints.auth.loginPhone,
    data,
  })
export const apiRegisterWithPhone = (data) =>
  axios({
    method: "post",
    url: endpoints.auth.registerPhone,
    data,
  })
export const apiRegisterWithEmail = (data) =>
  axios({
    method: "post",
    url: endpoints.auth.registerEmail,
    data,
  })

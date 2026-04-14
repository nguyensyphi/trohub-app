import axios, { endpoints } from "./axios"

export const apiGetResponseChatbot = (data) =>
  axios({
    method: "post",
    url: endpoints.chatbot.endpoints,
    data,
  })
export const apiSearchChatbot = (params) =>
  axios({
    method: "get",
    url: endpoints.chatbot.search,
    params,
  })

import useSWR from "swr"
import axios, { endpoints, internalFetcher } from "./axios"
import { useMemo } from "react"

export const apiCreateNewPost = (data) =>
  axios({
    method: "post",
    url: endpoints.post.createNew,
    data,
  })
export const apiSaveTheDraft = (data) =>
  axios({
    method: "post",
    url: endpoints.post.saveTheDraft,
    data,
  })
export const useGetUserPost = (params, options) => {
  const URL = params ? [endpoints.post.getUserPost, { params }] : endpoints.post.getUserPost

  const { data, isLoading, isValidating, error, mutate } = useSWR(URL, internalFetcher, options)

  const memoizedValue = useMemo(
    () => ({
      data: data?.data ? data.data : data,
      isLoading,
      isValidating,
      error,
      mutate,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, isValidating, error, data]
  )
  return memoizedValue
}
export const apiUpdatePostByUser = (data, id) =>
  axios({
    method: "put",
    url: endpoints.post.updatePostByUser + id,
    data,
  })
export const apiRemovePostByUser = (params) =>
  axios({
    method: "delete",
    url: endpoints.post.removePostByUser,
    params,
  })
export const useGetPublicPosts = (params, options) => {
  const URL = params ? [endpoints.post.getPublicPosts, { params }] : endpoints.post.getPublicPosts

  const { data, isLoading, isValidating, error, mutate } = useSWR(URL, internalFetcher, options)

  const memoizedValue = useMemo(
    () => ({
      data: data?.data ? data.data : data,
      isLoading,
      isValidating,
      error,
      mutate,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, isValidating, error, data]
  )
  return memoizedValue
}
export const useGetPostById = (idPost, options) => {
  const URL = endpoints.post.getPostById + idPost

  const { data, isLoading, isValidating, error, mutate } = useSWR(URL, internalFetcher, options)

  const memoizedValue = useMemo(
    () => ({
      data: data?.data ? data.data : data,
      isLoading,
      isValidating,
      error,
      mutate,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, isValidating, error, data]
  )
  return memoizedValue
}
export const apiRatingPost = (data) =>
  axios({
    method: "post",
    url: endpoints.post.ratingPost,
    data,
  })
export const apiCreateNewComment = (data) =>
  axios({
    method: "post",
    url: endpoints.post.commentPost,
    data,
  })
export const apiUpdateStatusAdmin = (id, data) =>
  axios({
    method: "put",
    url: endpoints.admin.updateStatus + id,
    data,
  })
export const useGetPostByAdmin = (params, options) => {
  const URL = params ? [endpoints.admin.getPostsAdmin, { params }] : endpoints.admin.getPostsAdmin

  const { data, isLoading, isValidating, error, mutate } = useSWR(URL, internalFetcher, options)

  const memoizedValue = useMemo(
    () => ({
      data: data?.data ? data.data : data,
      isLoading,
      isValidating,
      error,
      mutate,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, isValidating, error, data]
  )
  return memoizedValue
}
export const useGetOrdersByAdmin = (params, options) => {
  const URL = params ? [endpoints.admin.getOrdersAdmin, { params }] : endpoints.admin.getOrdersAdmin

  const { data, isLoading, isValidating, error, mutate } = useSWR(URL, internalFetcher, options)

  const memoizedValue = useMemo(
    () => ({
      data: data?.data ? data.data : data,
      isLoading,
      isValidating,
      error,
      mutate,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, isValidating, error, data]
  )
  return memoizedValue
}
export const useGetOrdersByOwner = (params, options) => {
  const URL = params ? [endpoints.order.getOrders, { params }] : endpoints.order.getOrders

  const { data, isLoading, isValidating, error, mutate } = useSWR(URL, internalFetcher, options)

  const memoizedValue = useMemo(
    () => ({
      data: data?.data ? data.data : data,
      isLoading,
      isValidating,
      error,
      mutate,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, isValidating, error, data]
  )
  return memoizedValue
}
export const apiPublicPost = (id, data) =>
  axios({
    method: "put",
    url: endpoints.order.publicPost + id,
    data,
  })
export const apiDeleteOrder = (id) =>
  axios({
    method: "delete",
    url: endpoints.order.deleteOrder + id,
  })
export const apiDeletePostAdmin = (id) =>
  axios({
    method: "delete",
    url: endpoints.admin.deletePost + id,
  })

import { useMemo } from "react"
import axios, { endpoints, internalFetcher } from "./axios"
import useSWR from "swr"
import { swrOptions } from "@/lib/constant"

export const apiCreateNews = (data) =>
  axios({
    method: "post",
    url: endpoints.admin.createNews,
    data,
  })
export const useGetNewsAdmin = (params, options = swrOptions) => {
  const URL = params ? [endpoints.admin.getNewsAdmin, { params }] : endpoints.admin.getNewsAdmin

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
export const useGetNewsPublic = (params, options = swrOptions) => {
  const URL = params ? [endpoints.admin.getNewsPublic, { params }] : endpoints.admin.getNewsPublic

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
export const apiUpdateNews = (id, data) =>
  axios({
    method: "put",
    url: endpoints.admin.updateNews + id,
    data,
  })
export const apiDeleteNews = (params) =>
  axios({
    method: "delete",
    url: endpoints.admin.deleteNews,
    params,
  })
export const apiGetNewsById = (id) =>
  axios({
    method: "get",
    url: endpoints.admin.getNewsById + id,
  })

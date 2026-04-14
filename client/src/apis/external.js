import useSWR from "swr"
import { endpoints, externalFetcher } from "./axios"
import axios from "axios"
import { useMemo } from "react"

export const apiGetGoogleCredentials = (accesstoken) =>
  axios({
    method: "get",
    url: endpoints.auth.getCredentialGoogle + accesstoken,
  })

export const useGetAllProvinces = (options) => {
  const URL = endpoints.app.allProvinces

  const { data, isLoading, isValidating, error } = useSWR(URL, externalFetcher, options)

  const memoizedValue = useMemo(
    () => ({
      data,
      isLoading,
      isValidating,
      error,
    }),
    [isLoading, isValidating, error, data]
  )
  return memoizedValue
}
export const apiGetDistrictsByProvinceId = (id) =>
  axios({
    method: "get",
    url: endpoints.app.districtsByProvinceId + id,
  })
export const apiGetWardsByDistrictId = (id) =>
  axios({
    method: "get",
    url: endpoints.app.wardsByDistrictId + id,
  })
export const apiGetLocationsFromSearchTerm = (searchTerm) =>
  axios({
    method: "get",
    url: endpoints.app.locations + searchTerm,
  })
export const apiGetExchangeRate = () =>
  axios({
    method: "get",
    url: endpoints.app.exchangeRate,
  })

import { useMemo } from "react"
import axios, { endpoints, internalFetcher } from "./axios"
import useSWR from "swr"
import { swrOptions } from "@/lib/constant"

export const apiGetMe = () =>
  axios({
    method: "get",
    url: endpoints.user.getMe,
  })
export const apiSendOtpPhone = (data) =>
  axios({
    method: "post",
    url: endpoints.user.sendOtpPhone,
    data,
  })
export const apiVerifyOtpPhone = (data) =>
  axios({
    method: "post",
    url: endpoints.user.verifytpPhone,
    data,
  })
export const apiUpdateMe = (data) =>
  axios({
    method: "put",
    url: endpoints.user.updateMe,
    data,
  })
export const apiSendMailOtp = (data) =>
  axios({
    method: "post",
    url: endpoints.user.sendMail,
    data,
  })
export const apiVerifyEmail = (data) =>
  axios({
    method: "post",
    url: endpoints.user.verifyEmail,
    data,
  })
export const apiUserDeposit = (data) =>
  axios({
    method: "post",
    url: endpoints.user.deposit,
    data,
  })

export const apiDepositMoney = (data) =>
  axios({
    method: "post",
    url: endpoints.payment.depositVnpay,
    data,
  })
export const apiDepositMoneyMomo = (data) =>
  axios({
    method: "post",
    url: endpoints.payment.depositMomo,
    data,
  })
export const apiAddWishlist = (data) =>
  axios({
    method: "put",
    url: endpoints.user.addWishlist,
    data,
  })
export const useGetWishlist = (params, options = swrOptions) => {
  const URL = params ? [endpoints.user.getWishlist, { params }] : endpoints.user.getWishlist

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
export const useGetSeenPosts = (params, options = swrOptions) => {
  const URL = params ? [endpoints.user.getSeenPosts, { params }] : endpoints.user.getSeenPosts

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
export const apiExpirePost = (data) =>
  axios({
    method: "post",
    url: endpoints.user.expirePost,
    data,
  })
export const useGetUserAdmin = (params, options = swrOptions) => {
  const URL = params ? [endpoints.admin.getUserByAdmin, { params }] : endpoints.admin.getUserByAdmin

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
export const apiUpdateUserAdmin = (data, id) =>
  axios({
    method: "put",
    url: endpoints.admin.updateUser + id,
    data,
  })
export const apiDeleteUserAdmin = (params) =>
  axios({
    method: "delete",
    url: endpoints.admin.deleteUser,
    params,
  })
export const apiUpdateViews = () =>
  axios({
    method: "put",
    url: endpoints.user.updateViews,
  })
export const apiGetDashboard = (params) =>
  axios({
    method: "get",
    url: endpoints.user.getDashboard,
    params,
  })
export const apiUpdateRoleUpgrade = () =>
  axios({
    method: "put",
    url: endpoints.user.updateRoleOwner,
  })

export const apiResetPasswordRequired = (data) =>
  axios({
    method: "post",
    url: endpoints.user.resetPasswordRequired,
    data,
  })
export const apiResetPasswordVerify = (data) =>
  axios({
    method: "post",
    url: endpoints.user.resetPasswordVerify,
    data,
  })
export const useGetPaymentHistory = (params, options = swrOptions) => {
  const URL = params ? [endpoints.user.getPaymentHistory, { params }] : endpoints.user.getPaymentHistory

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
export const useGetExpiredHistory = (params, options = swrOptions) => {
  const URL = params ? [endpoints.user.getExpiredHistory, { params }] : endpoints.user.getExpiredHistory

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

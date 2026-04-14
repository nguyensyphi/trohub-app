import axios from "axios"

//===============================================================

const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_SERVER_URL })

axiosInstance.interceptors.request.use((config) => {
  const store = window.localStorage.getItem("trohub/me")
  if (store) {
    const parsedStore = JSON.parse(store)
    if (parsedStore && parsedStore.state?.token) {
      config.headers.Authorization = `Bearer ${parsedStore.state.token}`
    }
  }
  return config
})

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || "Something went wrong.")
)

export default axiosInstance

//=======================================================================

export const internalFetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args]

  const res = await axiosInstance.get(url, { ...config })

  return res
}

export const externalFetcher = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args]

  const res = await axios.get(url, { ...config })

  return res
}

//======================================================================

export const endpoints = {
  auth: {
    getCredentialGoogle: "https://www.googleapis.com/oauth2/v1/userinfo?access_token=",
    googleLogin: "/auth/google",
    loginEmail: "/auth/login-email",
    loginPhone: "/auth/login-phone",
    registerPhone: "/auth/register-phone",
    registerEmail: "/auth/register-email",
  },
  user: {
    getMe: "/user/me",
    updateMe: "/user/me",
    sendOtpPhone: "/user/send-otp",
    verifytpPhone: "/user/verify-otp",
    sendMail: "/user/send-mail",
    verifyEmail: "/user/verify-mail",
    deposit: "/user/deposit",
    addWishlist: "/user/wishlist",
    getWishlist: "/user/wls",
    getSeenPosts: "/user/seen-posts",
    expirePost: "/user/expire-post",
    updateViews: "/user/views",
    getDashboard: "/user/dashboard",
    updateRoleOwner: "/user/upgrade-owner",
    getPaymentHistory: "/user/payment-history",
    getExpiredHistory: "/user/expired-history",
    resetPasswordRequired: "/user/reset-password-required",
    resetPasswordVerify: "/user/reset-password-verify",
  },
  app: {
    allProvinces: "https://vietnam-administrative-division-json-server-swart.vercel.app/province",
    districtsByProvinceId:
      "https://vietnam-administrative-division-json-server-swart.vercel.app/district/?idProvince=",
    wardsByDistrictId:
      "https://vietnam-administrative-division-json-server-swart.vercel.app/commune/?idDistrict=",
    locations: "https://nominatim.openstreetmap.org/search?format=json&q=",
    exchangeRate: `https://v6.exchangerate-api.com/v6/${import.meta.env.VITE_EXCHANGERATE_API}/latest/USD`,
  },
  post: {
    createNew: "/post/new",
    getUserPost: "/post/user",
    updatePostByUser: "/post/update/",
    removePostByUser: "/post/remove/",
    getPublicPosts: "/post/public/",
    getPostById: "/post/one/",
    ratingPost: "/post/rating/",
    commentPost: "/post/comment-new/",
  },
  payment: {
    depositVnpay: "/payment/deposit",
    depositMomo: "/payment/momo/create",
    depositQR: "/payment/create-order",
  },
  chatbot: {
    endpoints: "/chatbot/endpoint",
    search: "/chatbot/search",
  },
  admin: {
    createNews: "/news/new",
    getNewsAdmin: "/news/admin",
    getNewsPublic: "/news/public",
    updateNews: "/news/update/",
    deleteNews: "/news/delete",
    getNewsById: "/news/one/",
    getUserByAdmin: "/user/admin",
    updateUser: "/user/admin/",
    deleteUser: "/user/admin",
    updateStatus: "/post/update-status/",
    getOrdersAdmin: "/post/admin/orders",
    getPostsAdmin: "/post/admin/posts",
    deletePost: "/post/remove-by-admin/",
  },
  order: {
    getOrders: "/order/all",
    publicPost: "/order/public-post/",
    deleteOrder: "/order/one/",
  },
}

import App from "./App"
import pathnames from "./lib/pathnames"
import { AdminGeneral, AdminLayout, CreateNews, ManageNews, ManagePostAdmin, ManageUser } from "./pages/admin"
import {
  BalanceInfo,
  CreatePost,
  Deposit,
  DepositVnpay,
  ExpiredHistory,
  General,
  ManagePost,
  OwnerLayout,
  PaymentHistory,
} from "./pages/owners"
import ManageOrder from "./pages/owners/ManageOrder"
import PaymentOnBoarding from "./pages/PaymentOnBoarding"
import {
  ChoThueCanHo,
  ChoThuePhongTro,
  DetailNews,
  DetailPost,
  Homepage,
  Login,
  News,
  NhaChoThue,
  PaymentNotice,
  PublicLayout,
  ResetPassword,
  SearchLayout,
  SetupPassword,
} from "./pages/publics"
import { ChangeEmail, ChangePhone, Personal, SeenPost, UserLayout, Wishlist } from "./pages/users"

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: pathnames.publics.layout,
        element: <PublicLayout />,
        children: [
          {
            path: pathnames.publics.homepage,
            element: <Homepage />,
          },
          {
            path: pathnames.publics.resetPassword,
            element: <ResetPassword />,
          },
          {
            path: pathnames.publics.updatePassword,
            element: <SetupPassword />,
          },
          {
            path: pathnames.publics.news,
            element: <News />,
          },

          {
            path: pathnames.publics.detailNews__id,
            element: <DetailNews />,
          },
          {
            path: pathnames.publics.search,
            element: <SearchLayout />,
          },
          {
            path: pathnames.publics.detailPost_idPost,
            element: <DetailPost />,
          },
          {
            path: pathnames.publics.login,
            element: <Login />,
          },
          {
            path: pathnames.publics.chothuecanho,
            element: <ChoThueCanHo />,
          },
          {
            path: pathnames.publics.chothuephongtro,
            element: <ChoThuePhongTro />,
          },
          {
            path: pathnames.publics.nhachothue,
            element: <NhaChoThue />,
          },
        ],
      },
      {
        path: pathnames.publics.payment__status,
        element: <PaymentNotice />,
      },
      {
        path: pathnames.user.layout,
        element: <UserLayout />,
        children: [
          {
            path: pathnames.user.personal,
            element: <Personal />,
          },
          {
            path: pathnames.user.changeEmail,
            element: <ChangeEmail />,
          },
          {
            path: pathnames.user.changePhone,
            element: <ChangePhone />,
          },
          {
            path: pathnames.user.seenPost,
            element: <SeenPost />,
          },
          {
            path: pathnames.user.wishlist,
            element: <Wishlist />,
          },
          {
            path: pathnames.user.paymentHistory,
            element: <PaymentHistory />,
          },
          {
            path: pathnames.user.expiredHistory,
            element: <ExpiredHistory />,
          },
          // Paypal
          // {
          //   path: pathnames.user.deposit,
          //   element: <Deposit />,
          // },
          {
            path: pathnames.user.depositVnpay,
            element: <DepositVnpay />,
          },
          {
            path: pathnames.user.balanceInfo,
            element: <BalanceInfo />,
          },
        ],
      },
      {
        path: pathnames.owner.layout,
        element: <OwnerLayout />,
        children: [
          {
            path: pathnames.owner.general,
            element: <General />,
          },
          {
            path: pathnames.owner.createPost,
            element: <CreatePost />,
          },
          {
            path: pathnames.owner.managePost,
            element: <ManagePost />,
          },
          {
            path: pathnames.owner.manageOrder,
            element: <ManageOrder />,
          },
        ],
      },
      {
        path: pathnames.paymentOnBoarding,
        element: <PaymentOnBoarding />,
      },
      {
        path: pathnames.admin.layout,
        element: <AdminLayout />,
        children: [
          {
            path: pathnames.admin.general,
            element: <AdminGeneral />,
          },
          {
            path: pathnames.admin.manageUser,
            element: <ManageUser />,
          },
          {
            path: pathnames.admin.createNews,
            element: <CreateNews />,
          },
          {
            path: pathnames.admin.manageNews,
            element: <ManageNews />,
          },
          {
            path: pathnames.owner.managePost,
            element: <ManagePostAdmin />,
          },
        ],
      },
    ],
  },
]

export default routes

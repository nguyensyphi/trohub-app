import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import PropTypes from "prop-types"
import { memo } from "react"
import { toast } from "sonner"

const initialOptions = {
  clientId: "test",
  currency: "USD",
  intent: "capture",
}

const PaypalButton = ({ number = 0, onSuccess }) => {
  console.log(number)
  return (
    <PayPalScriptProvider
      options={initialOptions}
      // options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        fundingSource={undefined}
        createOrder={(data, actions) => {
          const orderData = {
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: number.toString(),
                },
              },
            ],
          }
          return actions.order.create(orderData).then((orderId) => orderId)
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(() => {
            // Xử lý logic sau khi thanh toán thành công tại đây
            onSuccess()
          })
        }}
        onError={(err) => {
          console.error("PayPal Checkout Error:", err)
          toast.error("Có lỗi xảy ra trong quá trình thanh toán.")
        }}
      />
    </PayPalScriptProvider>
  )
}

export default memo(PaypalButton)
PaypalButton.propTypes = {
  number: PropTypes.number.isRequired,
  onSuccess: PropTypes.func,
}

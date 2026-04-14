const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer")
const path = require("path")
const fs = require("fs")

module.exports = {
  hassPassword: (pwd) => bcrypt.hashSync(pwd, bcrypt.genSaltSync(10)),
  sendMail: async (options) => {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    try {
      await transporter.sendMail(options)
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  },
  readHtmlTemplate: (otp) => {
    const templatePath = path.join(__dirname, "mail-template.html")
    let html = fs.readFileSync(templatePath, "utf8")

    // Thay thế {{OTP}} trong template bằng OTP thực tế
    html = html.replace("{{OTP}}", otp)
    return html
  },

  readHtmlTemplateExpired: ({ fullname, title, expiredDate }) => {
    const templatePath = path.join(__dirname, "expired-template.html")
    let html = fs.readFileSync(templatePath, "utf8")

    // Thay thế {{OTP}} trong template bằng OTP thực tế
    html = html
      .replace("{{fullname}}", fullname)
      .replace("{{title}}", title)
      .replace("{{expiredDate}}", expiredDate)
    return html
  },

  sortObject: (obj) => {
    let sorted = {}
    let str = []
    let key
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key))
      }
    }
    str.sort()
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+")
    }
    return sorted
  },
  textToNumbers: (text) => {
    const units = {
      nghìn: 1000,
      triệu: 1000000,
      tỷ: 1000000000,
    }

    // Regular expression để tìm số và đơn vị
    const regex = /(\d+)\s*(nghìn|triệu|tỷ)?/gi

    let result = []

    // Kiểm tra các từ khóa "nhỏ hơn", "lớn hơn", "hơn", "ít hơn"
    const isMoreThan =
      /lớn hơn/i.test(text) || /nhiều hơn/i.test(text) || /trên/i.test(text) || /lớn/i.test(text)
    const isLessThan = /nhỏ hơn/i.test(text) || /ít hơn/i.test(text) || /dưới/i.test(text)

    let match
    // Lặp qua từng kết quả match của regex
    while ((match = regex.exec(text)) !== null) {
      const number = parseInt(match[1]) // Chuyển đổi phần số thành integer
      const unit = match[2] ? units[match[2]] : 1 // Đơn vị nếu có, không có thì mặc định là 1
      const finalNumber = number * unit

      // Nếu "nhỏ hơn", đặt 0 làm số đầu và finalNumber là số cuối
      if (isLessThan) {
        result = [0, finalNumber]
      }
      // Nếu "lớn hơn", đặt finalNumber làm số đầu và 'gt' làm số cuối
      else if (isMoreThan) {
        result = ["gt", finalNumber]
      }
      // Nếu không có "nhỏ hơn" hay "lớn hơn", thêm số vào mảng
      else {
        result.push(finalNumber)
      }
    }

    return result
  },
}

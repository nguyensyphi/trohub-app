const { faker } = require("@faker-js/faker")
const { roles, genders, statuses, convenients, roomStatuses } = require("./contants")
const chothuecanho = require("../data/chothuecanho.json")
const nhachotue = require("../data/nhachothue.json")
const chothuephongtro = require("../data/chothuephongtro.json")

// const address = [
//   {
//     ward: "Phường Thới An Đông",
//     district: "Quận Bình Thuỷ",
//     province: "Thành phố Cần Thơ",
//     address: "Phường Thới An Đông, Quận Bình Thuỷ, Thành phố Cần Thơ",
//   },
//   {
//     ward: "Phường Tứ Liên",
//     district: "Quận Tây Hồ",
//     province: "Thành phố Hà Nội",
//     address: "Phường Tứ Liên, Quận Tây Hồ, Thành phố Hà Nội",
//   },
//   {
//     ward: "Xã Liên Khê",
//     district: "Huyện Thuỷ Nguyên",
//     province: "Thành phố Hải Phòng",
//     address: "Xã Liên Khê, Huyện Thuỷ Nguyên, Thành phố Hải Phòng",
//   },
//   {
//     ward: "Phường Hưng Thạnh",
//     district: "Quận Cái Răng",
//     province: "Thành phố Cần Thơ",
//     address: "Phường Hưng Thạnh, Quận Cái Răng, Thành phố Cần Thơ",
//   },
// ]
// const generateRandomRealEstateImages = () => {
//   const imageCount = faker.number.int({ min: 3, max: 8 })
//   const images = []

//   for (let i = 0; i < imageCount; i++) {
//     images.push(faker.image.urlLoremFlickr({ category: "estate" })) // Hoặc dùng faker.image.realEstate() nếu có
//   }

//   return JSON.stringify(images)
// }

const chothuecanhodata = chothuecanho.body.map((el, idx) => {
  const address = el.header.address
  const addressArray = address.split(",").map((el) => el.trim())
  const province = addressArray[addressArray.length - 1]
  const district = addressArray[addressArray.length - 2]
  const ward = addressArray[addressArray.length - 3]
  const price = faker.number.int({ min: 100000, max: 5000000 })
  const size = faker.number.int({ min: 5, max: 200 })
  return {
    title: el.header.title,
    address,
    province,
    district,
    ward,
    description: el.mainContent.content?.join(", "),
    media: JSON.stringify(el.images),
    price,
    priority: 0,
    size,
    bedroom: faker.number.int({ min: 0, max: 5 }),
    views: faker.number.int({ min: 0, max: 20 }),
    averageStar: 0,
    bathroom: faker.number.int({ min: 0, max: 5 }),
    postType: "Cho thuê căn hộ",
    gender: faker.helpers.arrayElement(genders),
    idUser: faker.number.int({ min: 1, max: 10 }),
    expiredDate: new Date(
      Date.now() + faker.number.int({ min: 2, max: 50 }) * 24 * 3600 * 1000
    ).toISOString(),
    verified: faker.datatype.boolean(),
    status: faker.helpers.arrayElement(statuses.filter((el) => el !== "Đang chờ duyệt")),
    roomStatus: faker.helpers.arrayElement(roomStatuses),
    convenient: JSON.stringify(faker.helpers.arrayElements(convenients)),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
})

const nhachothuedata = nhachotue.body.map((el, idx) => {
  const address = el.header.address
  const addressArray = address.split(",").map((el) => el.trim())
  const province = addressArray[addressArray.length - 1]
  const district = addressArray[addressArray.length - 2]
  const ward = addressArray[addressArray.length - 3]
  const price = faker.number.int({ min: 100000, max: 5000000 })
  const size = faker.number.int({ min: 5, max: 200 })
  return {
    title: el.header.title,
    address,
    province,
    district,
    ward,
    description: el.mainContent.content?.join(", "),
    media: JSON.stringify(el.images),
    price,
    priority: 0,
    size,
    bedroom: faker.number.int({ min: 0, max: 5 }),
    views: faker.number.int({ min: 0, max: 20 }),
    averageStar: 0,
    bathroom: faker.number.int({ min: 0, max: 5 }),
    postType: "Nhà cho thuê",
    gender: faker.helpers.arrayElement(genders),
    idUser: faker.number.int({ min: 1, max: 10 }),
    expiredDate: new Date(
      Date.now() + faker.number.int({ min: 2, max: 50 }) * 24 * 3600 * 1000
    ).toISOString(),
    verified: faker.datatype.boolean(),
    status: faker.helpers.arrayElement(statuses.filter((el) => el !== "Đang chờ duyệt")),
    roomStatus: faker.helpers.arrayElement(roomStatuses),
    convenient: JSON.stringify(faker.helpers.arrayElements(convenients)),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
})

const chothuephongtrodata = chothuecanho.body.map((el, idx) => {
  const address = el.header.address
  const addressArray = address.split(",").map((el) => el.trim())
  const province = addressArray[addressArray.length - 1]
  const district = addressArray[addressArray.length - 2]
  const ward = addressArray[addressArray.length - 3]
  const price = faker.number.int({ min: 100000, max: 5000000 })
  const size = faker.number.int({ min: 5, max: 200 })
  return {
    title: el.header.title,
    address,
    province,
    district,
    ward,
    description: el.mainContent.content?.join(", "),
    media: JSON.stringify(el.images),
    price,
    priority: 0,
    size,
    bedroom: faker.number.int({ min: 0, max: 5 }),
    views: faker.number.int({ min: 0, max: 20 }),
    averageStar: 0,
    bathroom: faker.number.int({ min: 0, max: 5 }),
    postType: "Cho thuê phòng trọ",
    gender: faker.helpers.arrayElement(genders),
    idUser: faker.number.int({ min: 1, max: 10 }),
    expiredDate: new Date(
      Date.now() + faker.number.int({ min: 2, max: 50 }) * 24 * 3600 * 1000
    ).toISOString(),
    verified: faker.datatype.boolean(),
    status: faker.helpers.arrayElement(statuses.filter((el) => el !== "Đang chờ duyệt")),
    roomStatus: faker.helpers.arrayElement(roomStatuses),
    convenient: JSON.stringify(faker.helpers.arrayElements(convenients)),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
})

module.exports = {
  users: Array(20)
    .fill("")
    .map((_, i) => ({
      email: faker.internet.email(),
      fullname: faker.person.fullName(),
      password: faker.internet.password(),
      avatar: `https://placekitten.com/200/200?image=${i}`,
      balance: parseFloat(faker.number.int({ min: 0, max: 1000 }) * 1000),
      phone: `0${faker.string.numeric(9)}`,
      resetPwdToken: null,
      resetPwdExpiry: null,
      phoneVerified: faker.datatype.boolean(),
      emailVerified: faker.datatype.boolean(),
      role: faker.helpers.arrayElement(roles),
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  posts: [...chothuephongtrodata, ...nhachothuedata, ...chothuecanhodata],
}

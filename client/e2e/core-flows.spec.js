import { test, expect } from "@playwright/test"

const mockUser = {
  id: 1,
  fullname: "QA Demo User",
  email: "qa-user@trohub.local",
  role: "Thành viên",
  balance: 100000,
  avatar: "/avatar.png",
  rWishlist: [],
}

const mockPost = {
  id: 101,
  title: "Phòng trọ QA trung tâm",
  media: ["/image.svg"],
  price: 2500000,
  bathroom: 1,
  bedroom: 1,
  size: 28,
  createdAt: "2026-04-08T08:00:00.000Z",
  gender: "Nam",
  address: "123 Đường QA, Hà Nội",
  verified: true,
  roomStatus: "Còn trống",
  status: "Đã duyệt",
  expiredDate: "2026-12-31T00:00:00.000Z",
  views: 42,
  averageStar: 4.5,
  postedBy: {
    fullname: "Chủ trọ QA",
    email: "owner@trohub.local",
    phone: "0909000111",
    avatar: "/avatar.png",
  },
  province: "Hà Nội",
  district: "Ba Đình",
  ward: "Phúc Xá",
  description: "<p>Phòng sạch đẹp, gần trung tâm.</p>",
}

async function mockCommonNetwork(page, user = mockUser) {
  await page.route("**/api/v1/user/views**", async (route) => {
    await route.fulfill({ status: 204, body: "" })
  })

  await page.route("**/api/v1/user/me**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        user,
        msg: "OK",
      }),
    })
  })

  await page.route("**/nominatim.openstreetmap.org/search?**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          lat: "21.0278",
          lon: "105.8342",
          display_name: "Hà Nội, Việt Nam",
        },
      ]),
    })
  })

  await page.route("**/vietnam-administrative-division-json-server-swart.vercel.app/**", async (route) => {
    const url = route.request().url()
    if (url.includes("/province")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([{ idProvince: "01", name: "Thành phố Hà Nội" }]),
      })
      return
    }
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
    })
  })
}

test.describe("Trohub Core E2E Flows", () => {
  test("Luồng đăng nhập / xác thực người dùng", async ({ page }) => {
    await mockCommonNetwork(page)

    await page.route("**/api/v1/auth/login-email**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          msg: "Đăng nhập thành công.",
          accessToken: "qa-token-001",
        }),
      })
    })

    await page.goto("/dang-nhap")

    await page.getByTestId("auth-input-email").fill("qa-user@trohub.local")
    await page.getByTestId("auth-input-password").fill("123456")
    await page.getByTestId("auth-submit-button").click()

    await expect(page).toHaveURL(/127\.0\.0\.1:4173\/(\?.*)?$/)
    await expect(page.getByRole("button", { name: "QA Demo User" })).toBeVisible()
  })

  test("Luồng tìm kiếm và lọc phòng", async ({ page }) => {
    await mockCommonNetwork(page)

    await page.route("**/api/v1/post/public/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          posts: [mockPost],
          pagination: {
            limit: 4,
            page: 1,
            count: 1,
            totalPages: 1,
          },
        }),
      })
    })

    await page.goto("/tim-kiem?address=Ha%20Noi&provinceId=01")

    await expect(page.getByTestId("search-filter-panel")).toBeVisible()
    await expect(page.getByTestId("post-card-101")).toBeVisible()

    await page.getByTestId("search-filter-title-input").fill("Phòng trọ QA")
    await page.getByTestId("search-filter-bedroom-input").fill("2")
    await page.getByTestId("search-filter-bathroom-input").fill("1")

    await page.getByTestId("search-filter-gender-trigger").click()
    await page.getByRole("option", { name: "Nam" }).click()

    await page.getByTestId("search-filter-price-trigger").click()
    await page.getByText("Từ 1 - 2 triệu").click()
    await page.getByTestId("search-filter-price-apply").click()

    await expect(page).toHaveURL(/title=Ph%C3%B2ng(?:%20|\+)tr%E1%BB%8D(?:%20|\+)QA/)
    await expect(page).toHaveURL(/bedroom=2/)
    await expect(page).toHaveURL(/bathroom=1/)
    await expect(page).toHaveURL(/gender=Nam/)
    await expect(page).toHaveURL(/price=/)
  })

  test("Luồng tương tác form gửi yêu cầu thuê (bình luận)", async ({ page }) => {
    await page.addInitScript((storedUser) => {
      window.localStorage.setItem(
        "trohub/me",
        JSON.stringify({
          state: {
            token: "qa-token-002",
            me: storedUser,
          },
          version: 0,
        })
      )
    }, mockUser)

    await mockCommonNetwork(page)

    let capturedPayload = null

    await page.route("**/api/v1/post/one/501**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          postData: { ...mockPost, id: 501, title: "Phòng QA cần thuê gấp" },
          voters: [],
          comments: [],
        }),
      })
    })

    await page.route("**/api/v1/post/comment-new/**", async (route) => {
      capturedPayload = JSON.parse(route.request().postData() || "{}")
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          msg: "Comment thành công.",
        }),
      })
    })

    await page.goto("/chi-tiet-tin-dang/501")

    await expect(page.getByTestId("detail-post-page")).toBeVisible()
    await expect(page.getByTestId("comment-form")).toBeVisible()

    const requestMessage = "Em muốn thuê phòng này từ tháng tới, cho em xin lịch hẹn xem phòng."
    await page.getByTestId("comment-textarea").fill(requestMessage)
    await page.getByTestId("comment-submit-button").click()

    await expect.poll(() => capturedPayload).not.toBeNull()
    await expect(capturedPayload.content).toBe(requestMessage)
    await expect(String(capturedPayload.idPost)).toBe("501")
  })
})

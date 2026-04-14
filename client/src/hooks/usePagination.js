import { useMemo } from "react"

const generateRange = (start, end) => {
  const length = end + 1 - start
  return Array.from({ length }, (_, index) => start + index)
}

const usePagination = ({ totalCount = 0, currentPage = 1, limit = 1, siblingCount = 1 }) => {
  const paginationArray = useMemo(() => {
    const pageSize = +limit // Items per page 4
    const paginationCount = Math.ceil(totalCount / pageSize) // Pages number 20/4=5
    const totalPaginationItem = siblingCount * 2 + 5 // Total pagination items to show =5

    // Nếu số trang tính ra mà nhỏ hơn 6 thì show 1 -> số trang
    if (paginationCount <= totalPaginationItem) return generateRange(1, paginationCount)
    // Nếu trước trang hiện tại có lớn hơn 3 items thì hiện 3 chấm bên trái
    const isShowLeft = +currentPage - siblingCount > 2
    // Nếu sau trang hiện tại có lớn hơn 3 items thì hiện 3 chấm bên phải
    const isShowRight = +currentPage + siblingCount < paginationCount - 1

    // Dấu 3 chấm bên trái, bên phải không -> hiện 5 số cuối
    if (isShowLeft && !isShowRight) {
      const rightStart = paginationCount - 4
      const rightRange = generateRange(rightStart, paginationCount)
      return [1, null, ...rightRange]
    }
    // Dấu 3 chấm bên phải, bên trái không -> hiện 5 số đầu
    if (!isShowLeft && isShowRight) {
      const leftRange = generateRange(1, 5)
      // const rightRange = generateRange(paginationCount - 1, paginationCount)
      return [...leftRange, null, paginationCount]
    }
    // Check sib khi ở trang đầu cuối
    const siblingLeft = Math.max(+currentPage - siblingCount, 1)
    const singlingRight = Math.min(+currentPage + siblingCount, paginationCount)
    // Hiện cả trái phải -> hiện thị sib
    if (isShowLeft && isShowRight) {
      const middleRange = generateRange(siblingLeft, singlingRight)
      return [1, null, ...middleRange, null, paginationCount]
    }
  }, [totalCount, currentPage, siblingCount, limit])

  return paginationArray || []
}
export default usePagination

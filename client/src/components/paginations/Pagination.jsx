import usePagination from "@/hooks/usePagination"
import PropTypes from "prop-types"
import {
  PaginationContent,
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { createSearchParams, useLocation, useNavigate, useSearchParams } from "react-router-dom"

const CustomPagination = ({ count = 0, limit = 0, page = 0 }) => {
  const paginations = usePagination({ totalCount: count, currentPage: page, limit })
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const handleChangePage = (number) => {
    const params = Object.fromEntries([...searchParams])
    params.page = number
    navigate({
      pathname: location.pathname,
      search: createSearchParams(params).toString(),
    })
  }

  return (
    <Pagination className="grid place-content-center">
      <PaginationContent>
        {paginations.map((el, idx) => (
          <PaginationItem key={idx}>
            {!el ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={
                  parseInt(searchParams.get("page")) === parseInt(el) ||
                  (!searchParams.get("page") && el === 1)
                }
                onClick={() => handleChangePage(el)}
                className="cursor-pointer"
              >
                {el}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  )
}

export default CustomPagination
CustomPagination.propTypes = {
  count: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
}

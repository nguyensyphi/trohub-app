import { useMeStore } from "@/zustand/useMeStore"
import { ConditionRender } from "../layouts"
import { createSearchParams, useLocation, useNavigate, useParams } from "react-router-dom"
import pathnames from "@/lib/pathnames"
import TextField from "./TextField"
import PropTypes from "prop-types"
import Comment from "./Comment"

const Comments = ({ onMutate, comments = [] }) => {
  const { me } = useMeStore()
  const location = useLocation()
  const navigate = useNavigate()
  const { idPost } = useParams()
  const numericIdPost = Number(idPost)

  const redirectLogin = () => {
    navigate({
      pathname: "/" + pathnames.publics.login,
      search: createSearchParams({ redirect: location.pathname }).toString(),
    })
  }
  return (
    <section className="space-y-3" data-testid="comments-section">
      <p className="font-bold" data-testid="comments-title">
        Thảo luận và nhận xét
      </p>
      <ConditionRender show={!me}>
        <p>
          Bạn phải{" "}
          <span
            className="underline cursor-pointer text-blue-600 font-bold"
            onClick={redirectLogin}
            data-testid="comments-login-required-link"
          >
            đăng nhập
          </span>{" "}
          trước mới được comment.
        </p>
      </ConditionRender>
      <ConditionRender show={!!me}>
        <div className="space-y-4">
          <TextField idPost={numericIdPost} onMutate={onMutate} />
          <p className="font-bold">Bình luận 👇</p>
          <ConditionRender show={comments.length === 0}>
            <p>Chưa có bình luận nào.</p>
          </ConditionRender>
          <div className="space-y-6" data-testid="comments-list">
            {comments
              .filter((el) => !el.idParent)
              .map((el) => (
                <Comment
                  id={el.id}
                  content={el.content}
                  idPost={el.idPost}
                  commentator={el.commentator}
                  key={el.id}
                  createdAt={el.createdAt}
                  onMutate={onMutate}
                  childs={comments.filter((item) => item.idParent === el.id)}
                />
              ))}
          </div>
        </div>
      </ConditionRender>
    </section>
  )
}

export default Comments
Comments.propTypes = {
  onMutate: PropTypes.func.isRequired,
  comments: PropTypes.array.isRequired,
}

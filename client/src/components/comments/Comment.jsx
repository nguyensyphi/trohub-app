import PropTypes from "prop-types"
import Image from "../layouts/Image"
import { defaultAvatar, fromNow } from "@/lib/utils"
import { EllipsisVertical, Reply } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useState } from "react"
import TextField from "./TextField"

const Comment = ({ id, content, commentator, createdAt, idPost, onMutate, childs = [], isChild = false }) => {
  const [isReply, setIsReply] = useState(false)
  return (
    <div className="relative bg-slate-50 rounded-md">
      <div className="flex relative p-4 flex-row gap-2">
        {!isChild && (
          <div className="absolute top-3 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsReply(true)} className="space-x-2">
                  <Reply size={16} />
                  <span>Trả lời</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <div className="w-fit flex-none">
          <Image
            src={commentator?.avatar}
            alt="Avatar"
            className="w-10 h-10 object-cover border rounded-full border-primary"
            fallbackSrc={defaultAvatar(commentator?.fullname)}
          />
        </div>
        <div className="flex flex-col flex-auto gap-2">
          <p className="font-bold">
            {commentator?.fullname} <span className="text-xs font-normal italic">({fromNow(createdAt)})</span>
          </p>
          <p>{content}</p>
        </div>
      </div>
      <div className="px-6">
        {childs.length > 0 &&
          childs.map((cmt) => (
            <Comment
              id={id}
              content={cmt.content}
              idPost={cmt.idPost}
              commentator={cmt.commentator}
              key={cmt.id}
              createdAt={cmt.createdAt}
              onMutate={onMutate}
              isChild={true}
            />
          ))}
      </div>

      {isReply && (
        <div className="px-6 my-3">
          <TextField
            isReply={isReply}
            onResetReply={() => setIsReply(false)}
            idParent={id}
            idPost={idPost}
            onMutate={onMutate}
          />
        </div>
      )}
    </div>
  )
}

export default Comment
Comment.propTypes = {
  id: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  idPost: PropTypes.number.isRequired,
  createdAt: PropTypes.instanceOf(Date),
  commentator: PropTypes.shape({
    fullname: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
  onMutate: PropTypes.func.isRequired,
  childs: PropTypes.array,
  isChild: PropTypes.bool,
}

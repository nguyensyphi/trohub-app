import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import PropTypes from "prop-types"
import { memo } from "react"
import { useNavigate } from "react-router-dom"

const Section = ({ children, title, className, isBack = false, onBack }) => {
  const navigate = useNavigate()
  const handleOnBack = () => {
    if (onBack) onBack()
    else navigate(-1)
  }
  return (
    <section className={cn("th-section-shell rounded-md mx-auto bg-white space-y-6 border p-6 border-slate-100", className)}>
      <header className="flex items-center">
        {isBack && (
          <Button className="bg-transparent w-fit hover:bg-transparent text-slate-900" onClick={handleOnBack}>
            <ArrowLeft />
          </Button>
        )}
        <h2 className="font-bold text-2xl">{title}</h2>
      </header>
      {children}
    </section>
  )
}

export default memo(Section)
Section.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  isBack: PropTypes.bool,
  onBack: PropTypes.func,
}

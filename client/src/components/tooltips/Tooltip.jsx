import PropTypes from "prop-types"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const CustomTooltip = ({ children, explain }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>
          <p className="font-normal">{explain}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default CustomTooltip
CustomTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  explain: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
}

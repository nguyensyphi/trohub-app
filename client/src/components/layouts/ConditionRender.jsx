import PropTypes from "prop-types"

const ConditionRender = ({ children, show }) => {
  return show ? children : null
}

export default ConditionRender

ConditionRender.propTypes = {
  children: PropTypes.node.isRequired,
  show: PropTypes.bool.isRequired,
}

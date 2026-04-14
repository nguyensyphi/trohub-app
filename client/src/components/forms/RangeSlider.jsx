/* eslint-disable react/prop-types */
import { cn } from "@/lib/utils"
import PropTypes from "prop-types"
import { Range, getTrackBackground } from "react-range"

const RangeSlider = ({ min = 0, max = 100, step = 1, values = [0, 100], onChange }) => {
  return (
    <Range
      min={min}
      max={max}
      step={step}
      values={values}
      onChange={onChange}
      renderTrack={({ props, children }) => (
        <div
          {...props}
          className={cn("w-full h-2 rounded-l-full rounded-r-full")}
          style={{
            ...props.style,
            background: getTrackBackground({
              values: values,
              colors: ["#F1F5F9", "#2563EB", "#F1F5F9"],
              min,
              max,
            }),
          }}
        >
          {children}
        </div>
      )}
      renderThumb={({ props }) => (
        <div {...props} key={props.key} className="w-4 h-4 rounded-full border bg-blue-600" />
      )}
    />
  )
}

export default RangeSlider

RangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  values: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func.isRequired,
}

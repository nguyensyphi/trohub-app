import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import PropTypes from "prop-types"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

const CustomEditor = ({ form, id, label, isRequired, placeholder }) => {
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      ["link", "image"],
      ["clean"],
    ],
  }

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
  ]
  return (
    <FormField
      name={id}
      control={form.control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-bold">
            {label}
            {isRequired && <span className="text-red-600 text-lg px-1">*</span>}
          </FormLabel>
          <FormControl>
            <ReactQuill
              theme="snow"
              modules={modules}
              formats={formats}
              placeholder={placeholder}
              className="text-slate-300 not-italic"
              {...field}
              onChange={(value) => field.onChange(value)}
              value={field.value}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default CustomEditor

CustomEditor.propTypes = {
  form: PropTypes.shape({
    control: PropTypes.object.isRequired,
    watch: PropTypes.func.isRequired,
  }).isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
}

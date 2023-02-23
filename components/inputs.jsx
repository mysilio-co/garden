import { useField, Form, FormikProps, Formik } from 'formik'

export function Input({
  className = '',
  inputClassName = '',
  errorClassName = '',
  ...props
}) {
  const [field, meta, helpers] = useField(props)
  const validationClassName = meta.touched
    ? meta.error
      ? 'error'
      : 'success'
    : ''
  return (
    <div className={`flex flex-col ${className}`}>
      <input
        className={`ipt ${validationClassName} ${inputClassName}`}
        {...field}
        {...props}
      />
      {meta.error && (
        <span className={`ipt-error-message ${errorClassName}`}>
          {meta.error.toString()}
        </span>
      )}
    </div>
  )
}

export function IconInput({
  icon,
  className = '',
  inputClassName = '',
  ...props
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        {icon}
      </div>
      <Input inputClassName={`pl-12 ${inputClassName}`} {...props} />
    </div>
  )
}

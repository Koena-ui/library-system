
export default function FormField({ label, name, error, as: Tag = "input", children, ...rest }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <Tag id={name} name={name} aria-invalid={!!error} {...rest}>
        {children}
      </Tag>
      {error && <span className="error" role="alert">{error}</span>}
    </div>
  );
}

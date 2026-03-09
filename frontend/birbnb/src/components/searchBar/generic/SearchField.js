function SearchField({ id, label, children, defaultValue, ...inputProps }) {
  return (
    <div className="search-field">
      <label>{label}</label>
      {children ? (
        children
      ) : (
        <input 
          id={id} 
          name={id} 
          defaultValue={defaultValue}
          {...inputProps} 
        />
      )}
    </div>
  );
}

export default SearchField;
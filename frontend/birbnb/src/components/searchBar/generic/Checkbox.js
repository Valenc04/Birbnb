function Checkbox({ id, label, defaultChecked = false }) {
  return (
    <div className="feature-checkbox">
      <input 
        type="checkbox" 
        id={id} 
        name={id}
        defaultChecked={defaultChecked}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}

export default Checkbox;
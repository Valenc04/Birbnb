function SearchButton() {
  return (
    <button type="submit" className="search-btn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        aria-hidden="true"
        style={{
          display: "block",
          height: "16px",
          width: "16px",
          stroke: "currentcolor",
          strokeWidth: 4,
        }}
      >
        <path fill="none" d="M13 24a11 11 0 1 0 0-22 11 11 0 0 0 0 22zm8-3 9 9" />
      </svg>
      Buscar
    </button>
  );
}

export default SearchButton;
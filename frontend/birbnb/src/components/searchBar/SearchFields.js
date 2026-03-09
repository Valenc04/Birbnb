import SearchField from "./generic/SearchField";

const SearchFields = ({
  initialDestino = '',
  initialHuespedes = '',
  initialPrecioMin = '',
  initialPrecioMax = '',
  initialFechaEntrada = '',
  initialFechaSalida = ''
}) => (
  <div className="search-grid">
    <SearchField 
      label="DESTINO" 
      placeholder="A dónde vas?" 
      id="DESTINO"
      defaultValue={initialDestino}
    />
    <SearchField label="FECHAS">
      <div className="date-input">
        <input 
          type="date" 
          name="fechaEntrada"
          defaultValue={initialFechaEntrada}
        />
        <input 
          type="date" 
          name="fechaSalida"
          defaultValue={initialFechaSalida}
        />
      </div>
    </SearchField> 
    <SearchField 
      label="HUESPEDES" 
      placeholder="¿Cuántos?" 
      type="number" 
      min="1" 
      id="HUESPEDES"
      defaultValue={initialHuespedes}
    />
    <SearchField label="PRECIO">
      <div className="price-input">
        <input 
          type="number" 
          placeholder="Mín" 
          min="0" 
          id="PRECIOMIN"
          name="PRECIOMIN"
          defaultValue={initialPrecioMin}
        />
        <span>–</span>
        <input 
          type="number" 
          placeholder="Máx" 
          min="0" 
          id="PRECIOMAX"
          name="PRECIOMAX"
          defaultValue={initialPrecioMax}
        />
      </div>
    </SearchField>
  </div>
);

export default SearchFields;
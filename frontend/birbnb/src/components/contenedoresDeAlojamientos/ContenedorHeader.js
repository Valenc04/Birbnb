const ContenedorHeader = ({ ciudad, pais }) => (

  <div className="alojamiento-container-header">
    <h2>
      {ciudad && pais ? (
        <>Alojamientos en {ciudad}, {pais}</>
      ) : (
        <>Resultados de búsqueda</>
      )}
    </h2>
  </div>
);

export default ContenedorHeader;

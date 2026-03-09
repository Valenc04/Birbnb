import './AlojamientoGaleria.css'

const AlojamientoGaleria = ({ fotos = [] }) => (
  <section className="galeria">
    <div className="img-principal">
      {fotos.length > 0 && <img src={fotos[0].path} alt="Imagen principal" />}
    </div>
    <div className="imgs-secundarias">
      {/* TODO: Hacer un diseño para q se puedan subir hasta 10 fotos pero meustre en la pantalla principal solo 5 y una opción de mostrar mas*/}
      {fotos.length > 1 &&
        fotos.slice(1, 5).map((imgSrc, idx) =>
          imgSrc ? (
            <div key={idx}>
              <img src={imgSrc.path} alt={`Imagen secundaria ${idx + 1}`} />
            </div>
          ) : null
        )}
    </div>
  </section>
)

export default AlojamientoGaleria
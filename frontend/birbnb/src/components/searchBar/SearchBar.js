import SearchButton from './generic/SearchButton';
import SearchCheckboxes from './SearchCheckboxes';
import SearchFields from './SearchFields';
import './SearchBar.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const SearchBar = ({ 
  initialValues = {
    DESTINO: '',
    HUESPEDES: '',
    PRECIOMIN: '',
    PRECIOMAX: '',
    fechaEntrada: '',
    fechaSalida: '',
    checkboxes: {
      wifi: false,
      pool: false,
      pets: false,
      parking: false
    }
  }
}) => {
  const navigate = useNavigate();
  
  // Desestructuración de initialValues
  const {
    DESTINO,
    HUESPEDES,
    PRECIOMIN,
    PRECIOMAX,
    fechaEntrada,
    fechaSalida,
    checkboxes
  } = initialValues;

  // Establecer valores iniciales después del renderizado
  useEffect(() => {
    const form = document.querySelector('.compact-search-bar');
    if (form) {
      if (DESTINO) form.elements.DESTINO.value = DESTINO;
      if (HUESPEDES) form.elements.HUESPEDES.value = HUESPEDES;
      if (PRECIOMIN) form.elements.PRECIOMIN.value = PRECIOMIN;
      if (PRECIOMAX) form.elements.PRECIOMAX.value = PRECIOMAX;
      if (fechaEntrada) form.elements.fechaEntrada.value = fechaEntrada;
      if (fechaSalida) form.elements.fechaSalida.value = fechaSalida;
      
      // Checkboxes
      form.elements.wifi.checked = checkboxes.wifi;
      form.elements.pool.checked = checkboxes.pool;
      form.elements.pets.checked = checkboxes.pets;
      form.elements.parking.checked = checkboxes.parking;
    }
  }, [DESTINO, HUESPEDES, PRECIOMIN, PRECIOMAX, fechaEntrada, fechaSalida, checkboxes]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const cantidadHuespedes = data.HUESPEDES;
    const precioMin = data.PRECIOMIN;
    const precioMax = data.PRECIOMAX;

    const wifi = data.wifi === 'on';
    const pool = data.pool === 'on';
    const pets = data.pets === 'on';
    const parking = data.parking === 'on';

    const destino = data.DESTINO;
    const [ciudad = '', pais = ''] = destino.split(',').map(item => item.trim());

    const fechaEntrada = data.fechaEntrada;
    const fechaSalida = data.fechaSalida;

    // Construir la lista de características seleccionadas
    const caracteristicas = [];
    if (wifi) caracteristicas.push('WIFI');
    if (pool) caracteristicas.push('PISCINA');
    if (pets) caracteristicas.push('MASCOTAS_PERMITIDAS');
    if (parking) caracteristicas.push('ESTACIONAMIENTO');

    const queryParams = new URLSearchParams();

    // Filtros opcionales
    if (precioMin) queryParams.append('min', precioMin);
    if (precioMax) queryParams.append('max', precioMax);
    if (cantidadHuespedes) queryParams.append('cantidad', cantidadHuespedes);
    if (caracteristicas.length > 0) queryParams.append('caracteristicas', caracteristicas.join(','));
    if (ciudad) queryParams.append('ciudad', ciudad);
    if (pais) queryParams.append('pais', pais);

    if (fechaEntrada && fechaSalida) {
      queryParams.append('rangoFechas', `${fechaEntrada},${fechaSalida}`);
    }

    // validaciones
    if (!ciudad && !pais && !cantidadHuespedes && !precioMin && !precioMax && 
        caracteristicas.length === 0 && (!fechaEntrada || !fechaSalida)) {
      alert('Por favor complete algún campo');
      return;
        }
      if (precioMin && precioMax && precioMin > precioMax) {
      alert('Precio mínimo no puede ser mayor que el precio máximo');
      return;
    }
    if (cantidadHuespedes && (isNaN(cantidadHuespedes) || (cantidadHuespedes < 1))) {
      alert('Cantidad de huéspedes debe ser un número positivo');
    return;
    }
    if (new Date(fechaEntrada) >= new Date(fechaSalida)) {
      alert('Fecha de entrada debe ser anterior a la fecha de salida');
      return;
    }


    navigate(`/app/alojamientosResults?${queryParams.toString()}`);
  };

  return (
    <section className="hero-search">
      <form className="compact-search-bar" onSubmit={handleSubmit}>
        <SearchFields 
          initialDestino={DESTINO}
          initialHuespedes={HUESPEDES}
          initialPrecioMin={PRECIOMIN}
          initialPrecioMax={PRECIOMAX}
          initialFechaEntrada={fechaEntrada}
          initialFechaSalida={fechaSalida}
        />
        <SearchCheckboxes 
          initialWifi={checkboxes.wifi}
          initialPool={checkboxes.pool}
          initialPets={checkboxes.pets}
          initialParking={checkboxes.parking}
        />
        <SearchButton />
      </form>
    </section>
  );
};

export default SearchBar;
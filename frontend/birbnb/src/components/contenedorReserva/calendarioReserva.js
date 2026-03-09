import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { DateRange } from 'react-date-range';
import format from 'date-fns/format';
import { es } from 'date-fns/locale';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import './calendario.css'

const DateRangeComp = forwardRef(({ onChange ,fechasOcupadas = [] }, ref) => {
  const [open, setOpen] = useState(false);
  const refOne = useRef(null);
  const [seleccionado, setSeleccionado] = useState(false);

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const limpiarSeleccion = () => {
    setSeleccionado(false);
    setRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      },
    ]);
    setOpen(false);
    onChange?.([null, null]);
    
  };

  useImperativeHandle(ref, () => ({
    abrirCalendario: () => setOpen(true),
  }));

  useEffect(() => {
    document.addEventListener('keydown', hideOnEscape, true);
    document.addEventListener('click', hideOnClickOutside, true);
  }, []);

  const hideOnEscape = (e) => {
    if (e.key === 'Escape') setOpen(false);
  };

  const hideOnClickOutside = (e) => {
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpen(false);
    }
  };

  return (
    <div className="calendarWrap">
      <input
        value={
          seleccionado
            ? `${format(range[0].startDate, 'dd/MM/yyyy')} a ${format(range[0].endDate, 'dd/MM/yyyy')}`
            : 'dd/mm/yyyy'
        }
        readOnly
        className={`inputBox ${!seleccionado ? 'placeholder-like' : ''}`}
        onClick={() => setOpen((open) => !open)}
      />

      <div ref={refOne}>
        {open && (
          
          <DateRange
            onChange={(item) => {
              const nuevaRango = [item.selection];
              setRange(nuevaRango);
              setSeleccionado(true);
              onChange?.([item.selection.startDate, item.selection.endDate]);
            }}
            editableDateInputs
            moveRangeOnFirstSelection={false}
            ranges={range}
            locale={es}
            months={2}
            direction="horizontal"
            className="calendarElement"
            minDate={new Date()}
            disabledDates={fechasOcupadas}
          />
        )}
        {seleccionado && (
          <button onClick={limpiarSeleccion} className="clear-button">
            Limpiar selección
          </button>
        )}
      </div>
    </div>
  );
});

export default DateRangeComp;

const transicionesValidas = {
  PENDIENTE: ['CONFIRMADA', 'RECHAZADA', 'CANCELADA'],
  CONFIRMADA: ['CANCELADA','RECHAZADA'],
  RECHAZADA: [],
  CANCELADA: ['CONFIRMADA'],
};

export function esTransicionValida(actual, nuevo) {
  return transicionesValidas[actual]?.includes(nuevo);
}
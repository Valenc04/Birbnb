export class LugarService {
    constructor(alojamientoRepositorio) {
        this.alojamientoRepositorio = alojamientoRepositorio;
    }

    /**
     * Obtiene lugares únicos (ciudad, provincia, país).
     * @param {string} q Texto de búsqueda opcional (para autocompletado).
     * @param {boolean} autocomplete Si true, aplica regex de búsqueda.
     * @param {number} limit Máximo de resultados a devolver.
     * @returns {Array} Lista de lugares encontrados.
     */
    async obtenerLugares(q, autocomplete = false, limit = 10) {
        return this.alojamientoRepositorio.obtenerLugares({ q, autocomplete, limit });
    }
}

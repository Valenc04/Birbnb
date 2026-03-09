export class LugaresController {
  constructor(lugarService) {
    this.lugarService = lugarService;
  }

  async findAll(req, res, next) {
    try {
      const { q, autocomplete, limit = 10 } = req.query;
      const resultado = await this.lugarService.obtenerLugares(q, autocomplete === "true", parseInt(limit));
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }
}

export class ReservaController {
  constructor(reservaService) {
    this.reservaService = reservaService;
  }

  create = async (req, res, next) => {
    try {
      const nuevaReserva = await this.reservaService.create(req.body);
      res.status(201).json(nuevaReserva);
    } catch (error) {
      next(error);
    }
  };

cambioEstado = async (req, res, next) => {
  try {
    const resultado = await this.reservaService.postCambioEstado(
      req.params.id,
      req.body
    );

    if (resultado?.eliminado) {
      return res.status(200).json({
        mensaje: 'Reserva rechazada y eliminada exitosamente',
        reservaId: resultado.reservaId,
      });
    }

    res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};
   
   disponible = async(req,res,next) => {
    try{
  
      const resultado = await this.reservaService.disponible(req.query,req.params.id
      );
      res.status(200).json(resultado)
    } catch(error){
      next(error);
    }
  }

  findAllByUserId = async (req, res, next) => {
    try {
      const reservasPaginadas = await this.reservaService.findAllByUserId(req.params.userId, req.query);

      return res.status(200).json(reservasPaginadas);

    } catch (error) {
      next(error);
    }
  };

  findAllByAnfitrionId = async (req, res, next) => {
    try {
      const reservasPaginadas = await this.reservaService.findAllByAnfitrionId(req.params.userId, req.query);

      return res.status(200).json(reservasPaginadas);

    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const actualizado = await this.reservaService.update(req.params.id, req.body);
      res.status(200).json(actualizado);

    } catch (error) {
      next(error);
    }
  };
}

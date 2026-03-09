export class UsuarioController {
  constructor(usuarioService) {
    this.usuarioService = usuarioService;
  }

  async create(req, res, next) {
    try {
      const usuario = await this.usuarioService.create(req.body);
      res.status(201).json(usuario);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const eliminated = await this.usuarioService.delete(req.params.id);
      res.status(200).send(eliminated);
    }
    catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query; // Parámetros opcionales
      const result = await this.usuarioService.findAll(page, limit);
      res.status(200).json(result);
    }
    catch (error) {
      next(error);
    }
  }
  async findByUser(req,res,next){
    try{

      const result = await this.usuarioService.findByUser(req.params.id);
      res.status(200).json(result);

    }catch(error){
    next(error);
    }
  }

  async findUser(req, res, next) {
    try {
      const result = await this.usuarioService.findUser(req.body)
      res.status(200).json(result)
    }
    catch (error) {
      next(error)
    }
  }

  async convertirEnAnfitrion(req, res, next) {
    try {
      const result = await this.usuarioService.convertirseEnAnfitrion(req.body)
      res.status(200).json(result)
    }
    catch (error) {
      next(error)
    }
  }

  async convertirEnHuesped(req, res, next) {
    try {
      const result = await this.usuarioService.convertirseEnHuesped(req.body)
      res.status(200).json(result)
    }
    catch (error) {
      next(error)
    }
  }

}
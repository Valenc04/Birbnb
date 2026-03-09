import { Usuario } from "../models/entidades/Usuario.js";
import { AlreadyExistsException, ValidationException, NotFoundException, ConflictException } from "../exceptions/ErroresComunes.js";
import { idSchema } from "../schemas/idSchema.js";
import { parseZodIssues } from '../utils/parseZodIssues.js';
export class UsuarioService {
  constructor(usuarioRepositorio) {
    this.usuarioRepositorio = usuarioRepositorio;
  }

  async create(usuarioData) {
    this.validarUsuario(usuarioData);

    const existe = await this.usuarioRepositorio.findByEmail(usuarioData.email);
    if (existe) {
        throw new AlreadyExistsException(`Ya existe un usuario con el mail ${usuarioData.email}`);
    }
    const usuario = new Usuario(usuarioData);
    const usuarioCreado = await this.usuarioRepositorio.create(usuario);
    return this.toDTO(usuarioCreado);
  }

  async findUser(usuarioData) {
    // this.validarUsuario(usuarioData) Lo hago para mejorar logeo de usuarios en UI (nico)

    const usuario = await this.usuarioRepositorio.findByEmail(usuarioData.email)
    if (!usuario) {
      throw new NotFoundException(`Usuario con email ${usuarioData.email} inexistente`)
    }
    if (usuarioData.password !== usuario.password) {
      throw new ValidationException(`Contraseña incorrecta`)
    }
    return this.toDTO(usuario)
  }
  async buscarUsuarioLogeado(email){
     const usuario = await this.usuarioRepositorio.findByEmail(email)
    if (!usuario) {
      throw new NotFoundException(`Usuario con email ${email} inexistente`)
    }
    return usuario;
  }
  async findByUser(idUser){
      const idUserResult = idSchema.safeParse(idUser);
        if (!idUserResult .success) {
          throw new ValidationException(`Error en ID: ${parseZodIssues(idUserResult.error.issues)}`);
        }
        const usuario = await this.usuarioRepositorio.findById(idUser)
        if(!usuario){
          throw new NotFoundException("Usuario no encontrado");
        }
        return this.toDTO(usuario)

  }

  async convertirseEnAnfitrion(usuarioData) {
    const email = usuarioData.email;

    const usuario = await this.usuarioRepositorio.findByEmail(email);
    if (!usuario) {
      throw NotFoundException(`Usuario con email ${email} inexistente`);
    }

    if (usuario.tipo === 'ANFITRION') {
      throw new ConflictException("El usuario ya es de tipo ANFITRION");
    }


    const instanciaDeUsuario = new Usuario(usuario);
    instanciaDeUsuario.serAnfitrion();


    const usuarioActualizado = await this.usuarioRepositorio.updatePorEmail(email, {
      tipo: 'ANFITRION'
    });

    if (!usuarioActualizado) {
      throw new ConflictException(`No se pudo convertir en anfitrión al usuario con mail ${email}`);
    }

    return this.toDTO(usuarioActualizado);
  }

  async convertirseEnHuesped(usuarioData) {
    const email = usuarioData.email;

    const usuario = await this.usuarioRepositorio.findByEmail(email);
    if (!usuario) {
      throw NotFoundException(`Usuario con email ${email} inexistente`);
    }

    if (usuario.tipo === 'HUESPED') {
      throw new ConflictException("El usuario ya es de tipo HUESPED");
    }


    const instanciaDeUsuario = new Usuario(usuario);
    instanciaDeUsuario.serHuesped();


    const usuarioActualizado = await this.usuarioRepositorio.updatePorEmail(email, {
      tipo: 'HUESPED'
    });

    if (!usuarioActualizado) {
      throw new ConflictException(`No se pudo convertir en huesped al usuario con mail ${email}`);
    }

    return this.toDTO(usuarioActualizado);
  }


  async findAll(page = 1, limit = 10) {
    const result = await this.usuarioRepositorio.findAll(
      parseInt(page),
      parseInt(limit)
    );

    return {
      ...result,
      items: result.items.map(alojamiento => this.toDTO(alojamiento))
    };
  }

  async delete(id) {
    const deleted = await this.usuarioRepositorio.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return deleted;
  }

  toDTO(usuario) {
    return {
      id: usuario._id,
      nombre: usuario.nombre?.trim() || '',
      email: usuario.email?.trim() || '',
      tipo: usuario.tipo?.trim() || 'HUESPED'
    };
  }

  validarUsuario(usuarioData) {
    const errores = []
    const resultadoContraseña = validarPassword(usuarioData.password)

    if(usuarioData.nombre && usuarioData.nombre.length < 6) {
      errores.push("El nombre debe contener al menos 6 caracteres | ")
    }

    if (!usuarioData.email || !/^\S+@\S+\.\S+$/.test(usuarioData.email)) {
      errores.push("Mail incompleto o incorrecto | ")
    }

    if (!resultadoContraseña.esValida) {
      errores.push("La contraseña no cumple con los siguientes requisito: ")
      errores.push(...resultadoContraseña.errores)
    }

    if (errores.length > 0) {
      throw new ValidationException(errores.join(" - "))
    }
  }
}

function validarPassword(password) {
  const errores = [];

  if (password.length < 8) {
    errores.push("Debe tener al menos 8 caracteres.");
  }
  if (!/[a-z]/.test(password)) {
    errores.push("Debe contener al menos una letra minúscula.");
  }
  if (!/[A-Z]/.test(password)) {
    errores.push("Debe contener al menos una letra mayúscula.");
  }
  if (!/\d/.test(password)) {
    errores.push("Debe contener al menos un número.");
  }

  if (errores.length > 0) {
    return { esValida: false, errores };
  } else {
    return { esValida: true, errores: [] };
  }
}

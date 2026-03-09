import { NotificacionService } from "../../../services/NotificacionService.js"
import { NotFoundException, ValidationException , CreationException , ConflictException ,DoesNotBelongToUserException } from "../../../exceptions/ErroresComunes.js"
import { beforeEach, describe, expect, it, jest ,test } from '@jest/globals';


describe("Testeo de la capa de SERVICE - Notificacion", () => {
  let service, mockRepo, mockRepoUsuario

  const notiId = "507f1f77bcf86cd799439011"
  const userId = "507f1f77bcf86cd799433456"

  const mockNotificacion = {
    id: notiId,
    mensaje: "Hola",
    usuario: userId,
    leida: false,
    fechaAlta: new Date(),
    fechaLeida: null
  }
  const mockUsuario = {
      id: userId,
      nombre: "Juan",
      email: "juan@mail.com"
    }

  beforeEach(() => {
    mockRepo = {
      findAllByFilter: jest.fn(),
      countAllByFilter: jest.fn(),
      findById: jest.fn(),
      findByUser: jest.fn(),
      update: jest.fn(),
      save: jest.fn()
    }
    mockRepoUsuario = {
      findById: jest.fn(),
      create: jest.fn(),
      findEmail: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn()
    }

    service = new NotificacionService(mockRepo, mockRepoUsuario)
  })

  describe("findByUserWithFiltro", () => {
    test("devuelve notificaciones paginadas correctamente", async () => {
      mockRepo.findAllByFilter.mockResolvedValue([mockNotificacion])
      mockRepo.countAllByFilter.mockResolvedValue(1)

      const result = await service.findByUserWithFiltro(userId)

      expect(result.page).toBe(1)
      expect(result.limit).toBe(10)
      expect(result.total).toBe(1)
      expect(result.data[0].id).toBe(notiId)
    })

    test("lanza error si el userId es inválido", async () => {
      await expect(service.findByUserWithFiltro("")).rejects.toThrow(ValidationException)
    })

    test("lanza error si alguna notificación no tiene usuario", async () => {
      mockRepo.findAllByFilter.mockResolvedValue([{ ...mockNotificacion, usuario: null }])
      await expect(service.findByUserWithFiltro(userId)).rejects.toThrow(NotFoundException)
    })
  })

  describe("findById", () => {
    test("devuelve la notificación correctamente", async () => {
      mockRepo.findById.mockResolvedValue(mockNotificacion)
      const result = await service.findById(notiId)
      expect(result.id).toBe(notiId)
    })

    test("lanza error si no se encuentra la notificación", async () => {
      mockRepo.findById.mockResolvedValue(null)
      await expect(service.findById(notiId)).rejects.toThrow(NotFoundException)
    })

    test("lanza error si el id es inválido", async () => {
      await expect(service.findById("")).rejects.toThrow(ValidationException)
    })
  })

  describe("marcarNotificacionComoLeida", () => {
    test("marca la notificación como leída si todo es válido", async () => {
      const noti = { ...mockNotificacion, marcarComoLeida: jest.fn(), usuario: userId, leida: false }
      mockRepo.findByUser.mockResolvedValue(noti)
      mockRepo.update.mockResolvedValue({ ...noti, leida: true })

      const result = await service.marcarNotificacionComoLeida(userId, notiId)
      expect(result.leida).toBe(true)
    })

    test("lanza error si ya está leída", async () => {
      const noti = { ...mockNotificacion, leida: true }
      mockRepo.findByUser.mockResolvedValue(noti)

      await expect(service.marcarNotificacionComoLeida(userId, notiId)).rejects.toThrow(ConflictException)
    })

    test("lanza error si no pertenece al usuario", async () => {
      const noti = { ...mockNotificacion, usuario: "otroUser" }
      mockRepo.findByUser.mockResolvedValue(noti)

      await expect(service.marcarNotificacionComoLeida(userId, notiId)).rejects.toThrow(DoesNotBelongToUserException)
    })

    test("lanza error si no se encuentra", async () => {
      mockRepo.findByUser.mockResolvedValue(null)
      await expect(service.marcarNotificacionComoLeida(userId, notiId)).rejects.toThrow(NotFoundException)
    })
  })

  describe("create", () => {
    test("crea una notificación correctamente", async () => {
      const nueva = { mensaje: "Hola", usuario: userId }
      mockRepo.save.mockResolvedValue({ ...mockNotificacion })
      mockRepoUsuario.findById.mockResolvedValue(mockUsuario)

      const result = await service.create(nueva)
      expect(result.mensaje).toBe("Hola")
      expect(result.usuario).toEqual(userId)
    })

    test("lanza error si faltan datos", async () => {
      await expect(service.create({ mensaje: "", usuario: "" })).rejects.toThrow(ValidationException)
    })

    test("lanza error si no se puede guardar", async () => {
      mockRepo.save.mockResolvedValue(null)
      mockRepoUsuario.findById.mockResolvedValue(mockUsuario)
      await expect(service.create({ mensaje: "Hola", usuario: userId })).rejects.toThrow(CreationException)
    })
  })

  describe("findByUser", () => {
    test("devuelve una notificación si es válida", async () => {
      mockRepo.findByUser.mockResolvedValue(mockNotificacion)
      const result = await service.findByUser(userId, notiId)
      expect(result.id).toBe(notiId)
    })

    test("lanza error si la notificación no existe", async () => {
      mockRepo.findByUser.mockResolvedValue(null)
      await expect(service.findByUser(userId, notiId)).rejects.toThrow(NotFoundException)
    })

    test("lanza error si el usuario no está en la notificación", async () => {
      mockRepo.findByUser.mockResolvedValue({ ...mockNotificacion, usuario: null })
      await expect(service.findByUser(userId, notiId)).rejects.toThrow(NotFoundException)
    })
  })
})

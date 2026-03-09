import dotenv from "dotenv";
import mongoose from "mongoose";
import { UsuarioModel } from "../models/dbModels/UsuarioModel.js";
import { AlojamientoModel } from "../models/dbModels/AlojamientoModel.js";

dotenv.config();

const seedUsers = [
  {
    nombre: "Anafitrion Demo",
    email: "anfitrion.demo@birbnb.local",
    password: "Demo1234",
    tipo: "ANFITRION",
  },
  {
    nombre: "Huesped Demo",
    email: "huesped.demo@birbnb.local",
    password: "Demo1234",
    tipo: "HUESPED",
  },
];

function buildMongoUri() {
  const dbUri = process.env.DB_URI?.trim() || "mongodb://127.0.0.1:27017";
  const dbName = process.env.DB_NAME?.trim() || "birbnb";
  const hasDbInUri = /\/\/[^/]+\/[^/?]+/.test(dbUri);
  const normalizedUri = dbUri.endsWith("/") ? dbUri.slice(0, -1) : dbUri;

  if (hasDbInUri) return normalizedUri;

  const queryIndex = normalizedUri.indexOf("?");
  if (queryIndex !== -1) {
    const baseUri = normalizedUri.slice(0, queryIndex);
    const query = normalizedUri.slice(queryIndex);
    return `${baseUri}/${dbName}${query}`;
  }

  return `${normalizedUri}/${dbName}`;
}

async function upsertUsers() {
  const usersByEmail = {};

  for (const user of seedUsers) {
    const upserted = await UsuarioModel.findOneAndUpdate(
      { email: user.email },
      { $set: user },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();
    usersByEmail[user.email] = upserted;
  }

  return usersByEmail;
}

function buildSeedAlojamientos(anfitrionId) {
  return [
    {
      anfitrion: anfitrionId,
      nombre: "Loft moderno en Buenos Aires",
      descripcion: "Loft luminoso con balcon y excelente ubicacion.",
      precioPorNoche: 85,
      moneda: "DOLAR_USA",
      horarioCheckIn: "15:00",
      horarioCheckOut: "11:00",
      direccion: {
        calle: "Av. Corrientes",
        altura: "1450",
        ciudad: {
          nombre: "Buenos Aires",
          pais: { nombre: "Argentina" },
        },
        lat: "-34.6037",
        long: "-58.3816",
      },
      cantHuespedesMax: 3,
      caracteristicas: ["WIFI", "ESTACIONAMIENTO", "MASCOTAS_PERMITIDAS"],
      fotos: [
        {
          descripcion: "Living del loft",
          path: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
        },
        {
          descripcion: "Dormitorio principal",
          path: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1400&q=80",
        },
      ],
    },
    {
      anfitrion: anfitrionId,
      nombre: "Departamento familiar en Palermo",
      descripcion: "Amplio departamento para familias y grupos pequenos.",
      precioPorNoche: 110,
      moneda: "DOLAR_USA",
      horarioCheckIn: "14:00",
      horarioCheckOut: "10:00",
      direccion: {
        calle: "Av. Santa Fe",
        altura: "3200",
        ciudad: {
          nombre: "Buenos Aires",
          pais: { nombre: "Argentina" },
        },
        lat: "-34.5875",
        long: "-58.4100",
      },
      cantHuespedesMax: 5,
      caracteristicas: ["WIFI", "PISCINA", "ESTACIONAMIENTO"],
      fotos: [
        {
          descripcion: "Comedor y sala",
          path: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1400&q=80",
        },
        {
          descripcion: "Habitacion secundaria",
          path: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1400&q=80",
        },
      ],
    },
    {
      anfitrion: anfitrionId,
      nombre: "Suite ejecutiva en Caballito",
      descripcion: "Suite confortable para viajes de trabajo o descanso.",
      precioPorNoche: 65,
      moneda: "DOLAR_USA",
      horarioCheckIn: "13:00",
      horarioCheckOut: "10:00",
      direccion: {
        calle: "Calle Libertad",
        altura: "84",
        ciudad: {
          nombre: "Caballito",
          pais: { nombre: "Venezuela" },
        },
        lat: "10.4806",
        long: "-66.9036",
      },
      cantHuespedesMax: 2,
      caracteristicas: ["WIFI"],
      fotos: [
        {
          descripcion: "Estar principal",
          path: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80",
        },
        {
          descripcion: "Cocina integrada",
          path: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1400&q=80",
        },
      ],
    },
    {
      anfitrion: anfitrionId,
      nombre: "Casa amplia en Caballito",
      descripcion: "Casa con patio, ideal para grupos y estadias largas.",
      precioPorNoche: 140,
      moneda: "DOLAR_USA",
      horarioCheckIn: "15:00",
      horarioCheckOut: "11:00",
      direccion: {
        calle: "Av. Principal",
        altura: "500",
        ciudad: {
          nombre: "Caballito",
          pais: { nombre: "Venezuela" },
        },
        lat: "10.4722",
        long: "-66.8841",
      },
      cantHuespedesMax: 6,
      caracteristicas: ["WIFI", "PISCINA", "MASCOTAS_PERMITIDAS", "ESTACIONAMIENTO"],
      fotos: [
        {
          descripcion: "Frente de la casa",
          path: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1400&q=80",
        },
        {
          descripcion: "Patio con pileta",
          path: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1400&q=80",
        },
      ],
    },
  ];
}

async function upsertAlojamientos(anfitrionId) {
  const alojamientos = buildSeedAlojamientos(anfitrionId);

  for (const alojamiento of alojamientos) {
    await AlojamientoModel.findOneAndUpdate(
      { nombre: alojamiento.nombre, anfitrion: alojamiento.anfitrion },
      { $set: alojamiento },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
  }
}

async function runSeed() {
  const mongoUri = buildMongoUri();
  await mongoose.connect(mongoUri);

  const usersByEmail = await upsertUsers();
  const anfitrion = usersByEmail["anfitrion.demo@birbnb.local"];

  if (!anfitrion?._id) {
    throw new Error("No se pudo crear/obtener el usuario anfitrion de seed.");
  }

  await upsertAlojamientos(anfitrion._id);

  console.log("Seed completado.");
  console.log(`DB: ${mongoose.connection.name}`);
  console.log("Usuarios seed: 2");
  console.log("Alojamientos seed: 4");
}

runSeed()
  .catch((error) => {
    console.error("Error al ejecutar seed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

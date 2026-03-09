import mongoose from "mongoose"
  
export class MongoDBConnection {
    
    static async connect() {
        if (mongoose.connection.readyState === 1) {
            console.log("🔁 Ya estás conectado a MongoDB")
            return mongoose
        }

        try {
            const dbUri = process.env.DB_URI?.trim() || 'mongodb://127.0.0.1:27017';
            const dbName = process.env.DB_NAME?.trim() || 'birbnb';
            const hasDbInUri = /\/\/[^/]+\/[^/?]+/.test(dbUri);
            const normalizedUri = dbUri.endsWith('/') ? dbUri.slice(0, -1) : dbUri;

            let fullUri = normalizedUri;
            if (!hasDbInUri) {
                const queryIndex = normalizedUri.indexOf('?');
                if (queryIndex !== -1) {
                    const baseUri = normalizedUri.slice(0, queryIndex);
                    const query = normalizedUri.slice(queryIndex);
                    fullUri = `${baseUri}/${dbName}${query}`;
                } else {
                    fullUri = `${normalizedUri}/${dbName}`;
                }
            }

            const connection = await mongoose.connect(fullUri)
            console.log(`✅ Conectado a MongoDB (${connection.connection.host})`)
            // return connection
        } catch (err) {
            if (err?.code === 'ENOTFOUND') {
                console.error("❌ No se pudo resolver el host de MongoDB. Revisa DB_URI o usa Mongo local (mongodb://127.0.0.1:27017).")
            }
            console.error("❌ Error al conectar a MongoDB:", err)
            process.exit(1)
        }
    }

    static async disconnect() {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect()
            console.log("🔌 Desconectado de MongoDB")
        }
    }
}

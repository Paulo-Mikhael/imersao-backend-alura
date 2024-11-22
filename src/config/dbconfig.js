import { MongoClient } from "mongodb";

export default async function conectarAoBanco(stringConexao){
  try {
    const mongoClient = new MongoClient(stringConexao);
    console.log("Conectando ao MongoDB...");
    await mongoClient.connect();
    console.log("Conectado ao MongoDB");

    return mongoClient;
  } catch (error) {
    console.error("Falha ao conectar com o MongoDB", error);
    process.exit();
  }
}
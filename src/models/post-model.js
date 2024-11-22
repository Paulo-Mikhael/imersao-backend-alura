import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbconfig.js";

const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

export async function getTodosPosts(){
  const db = conexao.db("imersao-instabytes");
  const colecao = db.collection("posts");

  return colecao.find().toArray();
}

export async function buscarPostPorId(id){
  try {
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    const objectId = ObjectId.createFromHexString(id);
  
    const post = colecao.findOne({ _id: new ObjectId(objectId) });

    return post;
  } catch (error) {
    console.error(`Erro ao buscar post de id ${id}`, error);
    return {};
  }
}

export async function criarPost(post){
  const db = conexao.db("imersao-instabytes");
  const colecao = db.collection("posts");

  return colecao.insertOne(post);
}

export async function atualizarPost(id, novoPost){
  const db = conexao.db("imersao-instabytes");
  const colecao = db.collection("posts");
  const objectId = ObjectId.createFromHexString(id);

  return colecao.updateOne({ _id: new ObjectId(objectId) }, { $set: novoPost });
}
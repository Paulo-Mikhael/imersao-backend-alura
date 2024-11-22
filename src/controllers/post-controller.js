import fs from "fs";
import gerarDescricaoComGemini from "../services/gemini-service.js";
import { getTodosPosts, buscarPostPorId, criarPost, atualizarPost } from "../models/post-model.js";

export async function listarPosts(request, reply) {
  try {
    const posts = await getTodosPosts();

    reply.status(200).json(posts);
  } catch (error) {
    console.error("Falha na função listarPost", error.message);
    reply.status(500).json({ erro: "Falha ao retornar todos os posts" });
  }
}

export async function retornarPostPorId(request, reply) {
  try {
    const posts = await buscarPostPorId(request.params.id);

    reply.status(200).json(posts);
  } catch (error) {
    console.error("Falha na função retornarPostPorId", error.message);
    reply.status(500).json({ erro: "Falha ao retornar post" });
  }
}

export async function postarNovoPost(request, reply){
  const novoPost = request.body;

  try {
    const postCriado = await criarPost(novoPost);

    reply.status(200).json(postCriado);
  } catch (error) {
    console.error("Falha na função postarNovoPost", error.message);
    reply.status(500).json({ erro: "Falha ao criar novo post" });
  }
}

export async function uploadImagem(request, reply){
  const novoPost = {
    descricao: "",
    imgUrl: request.file.originalname,
    imgAlt: ""
  };

  try {
    const postImagem = await criarPost(novoPost);
    const imagemAtualizada = `uploads/${postImagem.insertedId}.png`
    fs.renameSync(request.file.path, imagemAtualizada);

    reply.status(200).json(imagemAtualizada);
  } catch (error) {
    console.error("Falha na função uploadImagem", error.message);
    reply.status(500).json({ erro: "Falha ao enviar imagem" });
  }
}

export async function atualizarNovoPost(request, reply){
  const id = request.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`;

  try {
    const imageBuffer = fs.readFileSync(`uploads/${id}.png`);
    const descricao = await gerarDescricaoComGemini(imageBuffer);

    const postAtualizado = {
      descricao: descricao,
      imgUrl: urlImagem,
      imgAlt: request.body.imgAlt,
    }
    const postCriado = await atualizarPost(id, postAtualizado);

    reply.status(200).json(postCriado);
  } catch (error) {
    console.error("Falha na função atualizarPost", error.message);
    reply.status(500).json({ erro: "Falha ao atualizar post" });
  }
}
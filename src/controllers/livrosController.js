import NaoEncontrado from "../erros/NaoEncontrado.js";
import { autores, livros } from "../models/index.js";


// fetch("http://localhost:3000").then(async response => {
//     try {
//      const data = await response.json()
//      console.log('response data?', data)
//    } catch(error) {
//      console.log('Error happened here!')
//      console.error(error)
//    }
//   }) //solução para exibir erro no inspect do navegador

class LivroController {

  static listarLivros = async (req, res, next) => {
    try {
      const buscaLivros = livros.find();
      req.resultado = buscaLivros;

      next();

    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorId = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros.findById(id)
        .populate("autor", "nome")
        .exec();

      if (livroResultado !== null) {
        res.status(200).send(livroResultado);
      } else {
        next(new NaoEncontrado("Id do livro não localizado."));
      }
    } catch (erro) {
      next(erro);
    }
  };

  static cadastrarLivro = async (req, res, next) => {
    try {
      let livro = new livros(req.body);

      const livroResultado = await livro.save();

      res.status(201).send(livroResultado.toJSON());
    } catch (erro) {
      next(erro);
    }
  };

  static atualizarLivro = async (req, res, next) => {
    try {
      const id = req.params.id;
    
      const livroResultado = await livros.findByIdAndUpdate(id, {$set: req.body});

      if (livroResultado !== null) {
        res.status(200).send({message: "Livro atualizado com sucesso"});
      } else {
        next(new NaoEncontrado("Id do livro não localizado."))
      }  
    } catch (erro) {
      next(erro);
    }
  };

  static excluirLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros.findByIdAndDelete(id);

      if (livroResultado !== null) {
        res.status(200).send({message: "Livro removido com sucesso"});
      } else {
        next(new NaoEncontrado("Id do livro não localizado."))
      }
    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorFiltro = async (req, res, next) => {
    try {
      const busca = await processaBusca(req.query);

      if (busca !== null) {
        const livrosResultado = livros
          .find(busca)
          .populate("autor");

        req.resultado = livrosResultado;
        next();
      } else {
        res.status(200).send([]);
      }
      
    } catch (erro) {
      next(erro);
    }
  };
}

async function processaBusca(parametros) {
  const { editora, titulo, minPaginas, maxPaginas, nomeAutor } = parametros;

  //const regex = new RegExp(titulo, "i"); // usando o regex do JS

  let busca = {};

  if (editora) busca.editora = editora;
  if (titulo) busca.titulo = { $regex: titulo, $options: "i" }; //usando regex com operadores do MongoDB. 
  // O i é de ignore Case (upper or low)

  if (minPaginas || maxPaginas) busca.numeroPaginas = {};

  // gte = Greater Than or Equal (Maior ou Igual que)
  if(minPaginas) busca.numeroPaginas.$gte = minPaginas;

  // lte = Less Than or Equal (Menor ou Igual que)
  if(maxPaginas) busca.numeroPaginas.$lte = maxPaginas;

  if (nomeAutor) {
    const autor = await autores.findOne({ nome: nomeAutor });

    if (autor !== null) {
      busca.autor = autor._id;
    } else {
      busca = null;
    }

  }

  return busca;
}

export default LivroController;
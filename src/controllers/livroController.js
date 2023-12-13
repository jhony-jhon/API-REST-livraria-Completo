import livro from "../models/Livro.js";
import { autor } from "../models/Autor.js";

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
    
    static async listarLivros (req, res) {
        try {
            const listaLivros = await livro.find({});
            res.status(200).json(listaLivros);      
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - 
            falha na requisição` });
        }
    };

    static async listarLivroPorId (req, res) {
        try {
            const id = req.params.id;
            const livroEncontrado = await livro.findById(id);
            res.status(200).json(livroEncontrado);      
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - 
            falha na requisição do livro` });
        }
    };

    static async cadastrarLivro (req, res) {
        const novoLivro = req.body;
        try {
            const autorEncontrado = await autor.findById(novoLivro.autor);
            const livroCompleto = { ...novoLivro, autor: { ...autorEncontrado}};
            const livroCriado = await livro.create(livroCompleto);
            res.status(201).json({ message: "criado com sucesso!", livro: 
            livroCriado });
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - falha ao 
            cadastrar livro` });
        }
    };

    static async atualizarLivro (req, res) {
        try {
            const id = req.params.id;
            await livro.findByIdAndUpdate(id, req.body);
            res.status(200).json({ message: "livro atualizado!" });      
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - 
            falha na atualização` });
        }
    }

    static async excluirLivro (req, res) {
        try {
            const id = req.params.id;
            await livro.findByIdAndDelete(id);
            res.status(200).json({ message: "livro excluido com sucesso!" });      
        } catch (erro) {
            res.status(500).json({ message: `${erro.message} - 
            falha ao excluir o livro` });
        }
    }

}

export default LivroController;
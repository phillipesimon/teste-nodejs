const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json()); //informando o express que a api vai receber informações no formato json
app.use(cors());

const repositories = []; //Simulando um bd com o array repositories

// Listando todos os repositórios existentes
app.get("/repositories", (request, response) => {

    return response.json(repositories);

});

// Criando um novo repositorio
app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body;

    const repository = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0,
    };

    // Adicionando o novo repositorio no final do array repositories
    repositories.push(repository);

    // Exibindo o novo repositorio
    return response.json(repository);

});

// Editando um repositorio
app.put("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const { url, title, techs } = request.body;

    // Procutando o repositorio que será modificado
    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    // Mensagem de erro caso o repositorio nao seja encontrado
    if (repositoryIndex < 0) {
        return response.status(400).json({ error: 'Repository does not exist' });
    }

    // Criando as edições e mantendo os dados do like
    const upDateRepository = {
        id,
        url,
        title,
        techs,
        likes: repositories[repositoryIndex].likes,
    }

    // Modificando os dados no bd
    repositories[repositoryIndex] = upDateRepository;

    // Retornando o repositorio editado
    return response.json(upDateRepository);

});

// Deletando um repositorio
app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;

    // Procurando o repositorio que será excluido
    const deleteRepository = repositories.findIndex(repository => repository.id === id);

    // Caso nao seja encontrado será exibida uma mensagem de erro
    if (deleteRepository < 0) {
        return response.status(400).json({ error: 'Repository does not exist' });
    }

    // Deletando o repositorio
    repositories.splice(deleteRepository, 1);

    return response.status(204).send();
});

// Modificando a quantidade de likes
app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params;

    // Procurando o repositorio que sera modificado
    const repository = repositories.find(repository => repository.id === id);

    // Caso nao seja encontrado será exibida uma mensagem de erro
    if (!repository) {
        return response.status(400).json({ error: 'Repository not found' });
    }

    // Incrementando
    repository.likes += 1;

    // Retornando o repositorio com a quantidade de likes modificada
    return response.json(repository);

});

module.exports = app;
# 4Devs-API

API desenvolvida durante o treinamento do instrutor Rodrigo Manguinho, treinamento voltado para clean architecture e domain driven design em node js usando typescript.

## Apresentação.

A proposta do projeto é fornecer serviços capazes de criar, responder e obter os resultados de uma determinada pesquisa.
Acesse: [4Devs-API]('') para usar a documentação.

## Padrões de projeto.

- Factory
- Builder
- Singleton
- Adapter
- Composite
- Composition root

## Princípios seguidos.

- POO
- SOLID

## Metodologias

- TDD
- Clean Architecture
- DDD
- Conventional Commits

## Funcionalidades.

- Criar conta de usuário
- Acessar a api usando a conta do usuário.
- Criar enquete (Disponível apenas para usuários com privilégios administrativos)
- Responder enquete
- Listar enquete
- Consultar o resultado da enquete.

## Ambiente de desenvolvimento.

- Certifique-se de ter o docker e o docker compose instalados em sua máquina.

- Crie um clone do repositório em sua máquina.

- Acesse a pasta raiz do projeto e execute `npm install` ou` npm ci` para recuperar todas as dependências do projeto.

- Logo após terminar de obter todas as dependências do projeto, execute `npm run up` para levantar o docker container, lembre-se que será a primeira vez que este processo será executado em sua máquina, logo irá baixar a imagem do mongo db, node js 15.x e criará uma imagem do projeto a ser executado no docker.

- OBS: Após todo o procedimento, o projeto ainda precisará de mais 20 segundos para estabelecer uma conexão entre os contêineres.

- Após todos esses passos, você poderá acessar a documentação feita em swagger no endereço: http://localhost:3333/api/docs

- Para descartar todos os contêineres relacionados à execução do aplicativo execute: `npm run down`
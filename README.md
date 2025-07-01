API de Grade de Programação de TV
📖 Descrição do Projeto
Esta é uma API RESTful desenvolvida em Node.js e Express para gerenciar a grade de programação de um canal de TV. O sistema permite o cadastro, consulta, atualização e exclusão de programas, e possui uma funcionalidade chave que impede o agendamento de programas em horários conflitantes.

Este projeto foi desenvolvido como parte de um processo seletivo, demonstrando habilidades em desenvolvimento backend, modelagem de dados com ORM, e criação de APIs seguras e bem estruturadas.

✨ Funcionalidades Principais

	  CRIAR um novo programa.
	  
	  LER todos os programas ou um programa específico por ID.
	  
	  ATUALIZAR as informações de um programa existente.
	  
	  DELETAR um programa.
	  
	  Validação de Dados: Garante que todos os dados enviados para a API estejam no formato correto.
	  
	  Verificação de Conflito de Horários: Impede que um novo programa seja cadastrado em um dia e horário que já esteja ocupado.
	  
	  Upload de Imagem: Permite o envio de uma imagem de capa para o programa, que é armazenada em formato Base64.

🛠️ Tecnologias Utilizadas
		Backend: Node.js, Express.js
		
		Banco de Dados: MySQL
		
		ORM: Sequelize
		
		Validação: Yup (ou outra biblioteca de sua escolha)
		
		Upload: Multer (para processar o envio de arquivos)

⚙️ Pré-requisitos
		Antes de começar, você precisará ter as seguintes ferramentas instaladas em sua máquina:
	
		Node.js (versão 18 ou superior)
		Git
		Um servidor de banco de dados MySQL rodando localmente.

🚀 Como Rodar o Projeto
		Siga os passos abaixo para configurar e executar a aplicação em seu ambiente local.

1. Clonar o Repositório
	
		git clone https://github.com/luanhenrique138/teste-f12.git
		cd teste-f12
		
		
2. Instalar as Dependências - Este comando irá instalar todas as dependências listadas no package.json.
		
		npm install
		
		
3. Configurar o Ambiente - A configuração do banco de dados é feita localmente e não é enviada para o repositório por segurança.
		
		a. Crie o arquivo de configuração:
		
		Copie o arquivo de exemplo para criar seu arquivo de configuração local.
		
		cp config/config.example.json config/config.json
		
		
		b. Edite o arquivo config/config.json:
		
		Abra o arquivo config/config.json e adicione as credenciais do seu banco de dados MySQL (usuário, senha, e o nome que deseja dar ao banco).
		
		{
		  "development": {
		    "username": "seu_usuario_mysql",
		    "password": "sua_senha_mysql",
		    "database": "grade_programacao_db",
		    "host": "127.0.0.1",
		    "dialect": "mysql"
		  }
		}



4. Preparar o Banco de Dados
Execute os seguintes comandos do Sequelize CLI para criar a base de dados, rodar as migrations (criar as tabelas) e popular o banco com dados iniciais (se houver).

# 1. Cria a base de dados no seu MySQL
		npx sequelize-cli db:create

# 2. Roda as migrations para criar as tabelas
		npx sequelize-cli db:migrate

# 3. (Opcional) Roda os seeders para popular o banco com dados
		npx sequelize-cli db:seed:all


# 5. Iniciar a Aplicação - Com tudo configurado, inicie o servidor.
		npm start


O servidor estará rodando em http://localhost:8080/api/programas (ou a porta que você configurou). Você verá uma mensagem de confirmação no terminal.

# 📂 Testes com Postman

### OBS: ANTES DE IMPORTAR É NECESSARIO FAZER LOGIN NO POSTMAN

Para facilitar os testes, o projeto já inclui uma coleção pronta do Postman localizada em.
		
  	DocApi/postman_collection.json

# ✅ Como testar a API:

	1. Abra o [Postman](https://www.postman.com/)
	2. Clique em **"Import"** ou ctrl + o e copie o conteudo do arquivo 
	3. Selecione o arquivo:

5. Após a importação, você verá os seguintes endpoints prontos para uso:
	- ✔️ `GET /api/programas/` – Listar programas
	- ✔️ `GET /api/programas/:id` – Buscar por ID
	- ✔️ `POST /api/programas/cadastro` – Criar novo programa (com imagem)
	- ✔️ `PUT /api/programas/:id` – Editar programa
	- ✔️ `DELETE /api/programas/:id` – Deletar programa

Observação caso não consiga importar a collection - sobre upload de imagem: Para criar ou atualizar um programa com imagem, a requisição deve ser do tipo multipart/form-data, com os campos de texto e um campo do tipo file chamado imagemCapa.


### 🔐 Autenticação obrigatória

Todas as requisições exigem um token estático:

- Vá na aba **Authorization** de cada requisição
- Tipo: **Bearer Token**
- Token:  **minha-chave-secreta**

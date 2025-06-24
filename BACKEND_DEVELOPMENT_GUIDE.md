
# Guia para IA Desenvolver o Backend para o Sistema de Gerenciamento de Insumos de TI

**Objetivo Geral:**
Criar um servidor backend que gerencie todos os dados da aplicação "Sistema de Gerenciamento de Insumos de TI". Este backend substituirá o `localStorage` e o gerenciamento de estado local do React para persistência de dados, permitindo que ~5 usuários acessem e modifiquem os mesmos dados de forma centralizada através da interface web existente, hospedada em um servidor Linux na rede local.

**Tecnologias Sugeridas para o Backend (visando simplicidade para rede local):**
1.  **Node.js com Express.js:** Framework leve e popular para criar APIs RESTful em JavaScript/TypeScript. Recomenda-se TypeScript para manter consistência com o frontend.
2.  **SQLite:** Banco de dados relacional baseado em arquivo, ideal para configurações locais simples, pois não requer um servidor de banco de dados separado.
3.  **Autenticação:** Baseada em Token (JWT - JSON Web Token é o padrão).
4.  **Hashing de Senhas:** `bcrypt` para armazenar senhas de forma segura.

---
**Passo 1: Análise Detalhada do Frontend Existente**
---

A IA deve processar e entender os seguintes arquivos e conceitos do frontend:

1.  **`types.ts` - Estruturas de Dados:**
    *   Analisar CADA interface e enum: `User`, `AppUser`, `Product`, `ProductFormData`, `AddQuantityFormData`, `SubtractQuantityFormData`, `Company`, `ProductType` (enum), `AssetStatus`, `Asset`, `AssetFormData`, `DescriptorStatus`, `Descriptor`, `DescriptorFormData`, `LogEntryActionType`, `LogEntry`.
    *   Para cada interface, identificar:
        *   Todos os campos e seus tipos primitivos (string, number, boolean).
        *   Campos que são datas (`Date` no TS, serão strings ISO no backend/DB).
        *   Campos que são enums (ex: `Product.company` do tipo `Company`).
        *   Relacionamentos implícitos (ex: `Asset.responsibleUserId` refere-se a `AppUser.id`).
        *   Campos obrigatórios vs. opcionais.
    *   **Resultado esperado desta análise:** Um mapeamento claro de todas as entidades de dados e seus atributos.

2.  **`App.tsx` - Lógica de Gerenciamento de Dados:**
    *   **Estados Principais:** Identificar os `useState` que atualmente guardam os dados da aplicação: `appUsers`, `productTypes`, `products`, `assets`, `descriptors`, `movementLogs`. Estes são os dados que o backend precisará gerenciar.
    *   **Dados Iniciais (`initialAppUsers`, etc.):** Estes podem ser usados como base para "semear" (seed) o banco de dados do backend na primeira execução.
    *   **Funções CRUD (Create, Read, Update, Delete) Implementadas:**
        *   `handleLogin`, `handleLogout`, `handleChangeForcedPassword`: Lógica de autenticação.
        *   `handleAddAppUser`, `handleEditAppUser`, `handleDeleteAppUser`, `handleResetAppUserPassword`: Operações de usuário.
        *   `handleAddProductType`, `handleEditProductType`, `handleDeleteProductType`: Operações de tipos de produto.
        *   `handleAddProduct`, `handleUpdateProductQuantity`: Operações de produto.
        *   `handleAddAsset`, `handleUpdateAsset`, `handleDeleteAsset`, `handleImportAssets`: Operações de ativos (notar a lógica de importação de CSV).
        *   `handleAddDescriptor`, `handleUpdateDescriptor`, `handleDeleteDescriptor`: Operações de descritivos.
        *   `addLogEntry`: Criação de logs.
    *   **Lógica de Negócios e Validações embutidas nessas funções:**
        *   Verificação de duplicatas (ex: email de usuário, código de barras de produto, nome de tipo de produto).
        *   Regras de quantidade (não negativa).
        *   Regras para exclusão (ex: não excluir tipo de produto em uso).
        *   Geração de IDs (o backend precisará de uma estratégia para isso, ex: UUIDs).
        *   Geração de QR Code (o backend também pode gerar o valor do QR code).
    *   **Objeto `currentUser`:** Entender como é usado para determinar permissões (`isAdmin`) e o fluxo de `forcePasswordChange`.
    *   **Resultado esperado desta análise:** Uma lista de todas as operações de dados que o backend precisará expor via API, incluindo a lógica de negócios associada.

3.  **`constants.ts`:**
    *   Revisar constantes como `DEFAULT_ADMIN_EMAIL`, `DEFAULT_ADMIN_PASSWORD` para a criação do usuário administrador inicial no backend.
    *   `COMPANY_OPTIONS`, `ASSET_STATUS_OPTIONS`, `DESCRIPTOR_STATUS_OPTIONS` definem os valores válidos para os campos enum.

---
**Passo 2: Design e Configuração da Arquitetura do Backend**
---

1.  **Estrutura do Projeto (Node.js/Express.js com TypeScript):**
    A IA deve gerar uma estrutura de diretórios padrão:
    ```
    /insumos-ti-backend
    |-- /src
    |   |-- /config          // Configuração do DB, variáveis de ambiente
    |   |   |-- db.ts        // Conexão SQLite e inicialização de tabelas
    |   |   `-- index.ts
    |   |-- /controllers     // Lógica de manipulação de requisições
    |   |   |-- auth.controller.ts
    |   |   |-- user.controller.ts
    |   |   |-- product.controller.ts
    |   |   |-- productType.controller.ts
    |   |   |-- asset.controller.ts
    |   |   |-- descriptor.controller.ts
    |   |   `-- log.controller.ts
    |   |-- /middlewares     // Middlewares (autenticação, tratamento de erros)
    |   |   |-- auth.middleware.ts
    |   |   `-- isAdmin.middleware.ts
    |   |-- /models          // Definições de schema/tabela e interações com o DB (queries)
    |   |   |-- AppUser.model.ts
    |   |   |-- ProductType.model.ts
    |   |   |-- Product.model.ts
    |   |   |-- Asset.model.ts
    |   |   |-- Descriptor.model.ts
    |   |   `-- LogEntry.model.ts
    |   |-- /routes          // Definição dos endpoints da API
    |   |   |-- index.ts     // Agregador de rotas
    |   |   |-- auth.routes.ts
    |   |   |-- user.routes.ts
    |   |   // ...outras rotas
    |   |-- /services        // Lógica de negócios (se for mais complexa e separada dos controllers)
    |   |-- /utils           // Funções utilitárias (ex: hashing de senha)
    |   |-- app.ts           // Configuração principal do Express
    |   `-- server.ts        // Ponto de entrada para iniciar o servidor
    |-- tsconfig.json
    |-- package.json
    |-- .env                 // Para variáveis de ambiente (PORT, JWT_SECRET)
    `-- insumos_ti.db        // Arquivo do banco de dados SQLite (será criado)
    ```

2.  **Configuração do Banco de Dados SQLite (`src/config/db.ts`):**
    *   Usar o driver `sqlite3`.
    *   Função para conectar/criar o arquivo `insumos_ti.db`.
    *   **Função `initializeDatabase()`:** Esta função deve ser chamada na inicialização do servidor e conterá:
        *   Comandos `CREATE TABLE IF NOT EXISTS` para cada entidade mapeada no Passo 1.
        *   **Seed do Usuário Administrador:** Inserir o usuário administrador (`DEFAULT_ADMIN_EMAIL`) com a senha `DEFAULT_ADMIN_PASSWORD` (hasheada com `bcrypt`).
        *   **(Opcional) Seed dos Dados Iniciais:** Inserir os dados de `initialProductTypesData`, `initialProductsData`, etc., para facilitar os testes.

3.  **Definição das Tabelas SQL (dentro de `initializeDatabase()`):**
    A IA deve traduzir as interfaces TS para schemas SQL.

    *   **Tabela `app_users`:**
        *   `id` TEXT PRIMARY KEY (usar UUIDs gerados pelo backend)
        *   `name` TEXT NOT NULL
        *   `email` TEXT NOT NULL UNIQUE
        *   `password_hash` TEXT NOT NULL (armazenar hash da senha)
        *   `role` TEXT NOT NULL CHECK(role IN ('Administrador', 'Usuário comum'))
        *   `status` TEXT NOT NULL CHECK(status IN ('Ativo', 'Inativo'))
        *   `force_password_change` INTEGER DEFAULT 0 (0=false, 1=true)
        *   `created_at` TEXT NOT NULL (ISO 8601 string)
        *   `last_modified_at` TEXT NOT NULL (ISO 8601 string)

    *   **Tabela `product_types`:** (para normalizar `Product.type`)
        *   `id` INTEGER PRIMARY KEY AUTOINCREMENT
        *   `name` TEXT NOT NULL UNIQUE

    *   **Tabela `products`:**
        *   `id` TEXT PRIMARY KEY (UUID)
        *   `product_type_id` INTEGER NOT NULL (FOREIGN KEY REFERENCES `product_types(id)`)
        *   `brand` TEXT NOT NULL
        *   `model` TEXT NOT NULL
        *   `description` TEXT NOT NULL
        *   `barcode` TEXT NOT NULL UNIQUE
        *   `quantity` INTEGER NOT NULL DEFAULT 0
        *   `company` TEXT NOT NULL CHECK(company IN ('Catarinense Pharma', 'ABPlast', 'Catarinense Pharma Filial'))

    *   **Tabela `assets`:**
        *   `id` TEXT PRIMARY KEY (UUID)
        *   `asset_type` TEXT NOT NULL
        *   `serial_number` TEXT NOT NULL UNIQUE
        *   `brand` TEXT NOT NULL
        *   `model` TEXT NOT NULL
        *   `acquisition_date` TEXT NOT NULL (Formato YYYY-MM-DD)
        *   `status` TEXT NOT NULL CHECK(status IN ('Em uso', 'Disponível', 'Manutenção'))
        *   `location` TEXT NOT NULL
        *   `responsible_user_id` TEXT (FOREIGN KEY REFERENCES `app_users(id)` ON DELETE SET NULL)
        *   `observations` TEXT
        *   `qr_code_value` TEXT NOT NULL
        *   `maintenance_notes` TEXT

    *   **Tabela `descriptors`:**
        *   `id` TEXT PRIMARY KEY (UUID)
        *   `title` TEXT NOT NULL
        *   `equipment_type` TEXT NOT NULL
        *   `category` TEXT NOT NULL
        *   `status` TEXT NOT NULL CHECK(status IN ('Ativo', 'Inativo'))
        *   `technical_specifications` TEXT
        *   `minimum_requirements` TEXT
        *   `compatibility` TEXT
        *   `important_notes` TEXT
        *   `created_at` TEXT NOT NULL (ISO 8601 string)
        *   `updated_at` TEXT NOT NULL (ISO 8601 string)

    *   **Tabela `movement_logs`:**
        *   `id` TEXT PRIMARY KEY (UUID)
        *   `timestamp` TEXT NOT NULL (ISO 8601 string)
        *   `user_id_fk` TEXT (Pode ser `app_users.id` ou um valor especial como 'SYSTEM'. Chave estrangeira para `app_users.id` se não for 'SYSTEM')
        *   `username_display` TEXT NOT NULL (Nome do usuário para exibição, pode ser 'Sistema')
        *   `action_type` TEXT NOT NULL (Valores do enum `LogEntryActionType`)
        *   `description` TEXT NOT NULL
        *   `details` TEXT (JSON string para o objeto `details`)

    **Observações sobre as Tabelas:**
    *   Usar `TEXT` para datas e armazená-las no formato ISO 8601 (`YYYY-MM-DDTHH:MM:SS.sssZ`).
    *   Campos como `responsible_user_id` devem permitir `NULL`.
    *   Considerar `ON DELETE SET NULL` ou `ON DELETE CASCADE` apropriadamente para chaves estrangeiras.

---
**Passo 3: Implementação dos Endpoints da API (Rotas, Controllers, Models)**
---

A IA deve criar a lógica para cada endpoint, seguindo o padrão RESTful.

*   **Autenticação (`auth.routes.ts`, `auth.controller.ts`):**
    *   **`POST /api/auth/login`**
        *   Input: `{ email: string, password_param: string }` (do `LoginPage.tsx`)
        *   Lógica:
            1.  Buscar usuário por email no DB.
            2.  Se não existir ou status "Inativo", retornar erro 401/403.
            3.  Comparar `password_param` com `password_hash` usando `bcrypt.compare()`.
            4.  Se inválido, retornar erro 401.
            5.  Se válido, gerar JWT contendo `{ userId: appUser.id, username: appUser.name, isAdmin: appUser.role === 'Administrador', appUserId: appUser.id, forcePasswordChange: !!appUser.force_password_change }`.
            6.  Registrar log de login (sucesso/falha) na tabela `movement_logs`.
            7.  Output: `{ token: string, user: { id, username, isAdmin, appUserId, forcePasswordChange } }`
    *   **`POST /api/auth/force-change-password`** (Rota protegida por `auth.middleware.ts`)
        *   Input: `{ newPassword_param: string }` (do `ForceChangePasswordPage.tsx`)
        *   Lógica:
            1.  Obter `userId` do JWT (`req.user.userId`).
            2.  Hashear `newPassword_param` com `bcrypt`.
            3.  Atualizar `password_hash` e `force_password_change = 0` para o usuário no DB.
            4.  Registrar log de alteração de senha.
            5.  Output: Sucesso/erro.

*   **Middleware de Autenticação (`auth.middleware.ts`):**
    *   Verificar o header `Authorization: Bearer <token>`.
    *   Validar o JWT (usar `JWT_SECRET` do `.env`).
    *   Se válido, adicionar os dados decodificados do usuário (payload do JWT) a `req.user`.
    *   Se inválido, retornar 401.

*   **Middleware de Admin (`isAdmin.middleware.ts`):**
    *   Verificar `req.user.isAdmin`. Se não for admin, retornar 403.

*   **CRUD para `AppUser` (`user.routes.ts`, `user.controller.ts`, `AppUser.model.ts`):**
    *   Todas as rotas protegidas por `auth.middleware.ts` e `isAdmin.middleware.ts`.
    *   `GET /api/users`: Listar todos (sem `password_hash`).
    *   `POST /api/users`: Criar. Input: `AddUserFormData`. Hashear senha. Gerar ID (UUID). `createdAt`, `lastModifiedAt`. Registrar log.
    *   `PUT /api/users/:id`: Editar. Input: `EditUserFormData`. `lastModifiedAt`. Registrar log.
    *   `DELETE /api/users/:id`: Excluir. Atualizar `responsible_user_id` para `NULL` em `assets`. Registrar log.
    *   `POST /api/users/:id/reset-password`: Input: `newPassword_param`. Hashear. `force_password_change = 1`. `lastModifiedAt`. Registrar log.

*   **CRUD para `ProductType` (`productType.routes.ts`, etc.):**
    *   `GET /api/product-types`: Listar.
    *   `POST /api/product-types`: Criar. Input: `{ name: string }`. Protegido por Admin. Validar nome único. Registrar log.
    *   `PUT /api/product-types/:id`: Editar. Input: `{ name: string }`. Protegido por Admin. Validar nome único. Registrar log.
    *   `DELETE /api/product-types/:id`: Excluir. Protegido por Admin. Validar se não está em uso por nenhum produto (verificar `product_type_id` na tabela `products`). Registrar log.

*   **CRUD para `Product` (`product.routes.ts`, etc.):**
    *   `GET /api/products`: Listar. Incluir nome do tipo de produto (JOIN com `product_types`).
    *   `POST /api/products`: Criar. Input: `ProductFormData & { company: Company }`. O campo `type` será o nome do tipo, o backend deve buscar o `id` correspondente na tabela `product_types`. Gerar ID (UUID). Quantidade inicial 0. Protegido por Admin. Validar barcode único. Registrar log.
    *   `PUT /api/products/:productId/quantity`: Atualizar quantidade. Input: `{ amountChange: number, purchaseOrder?: string, destinationAssetId?: string, ticketNumber?: string }`. Protegido por usuário logado. Validar quantidade não negativa. Registrar log com detalhes.

*   **CRUD para `Asset` (`asset.routes.ts`, etc.):**
    *   `GET /api/assets`: Listar. Incluir nome do usuário responsável (JOIN com `app_users`).
    *   `POST /api/assets`: Criar. Input: `AssetFormData`. Gerar ID (UUID). Gerar `qrCodeValue`. Protegido por Admin. Registrar log.
    *   `PUT /api/assets/:id`: Editar. Input: `AssetFormData`. Protegido por Admin. Gerar novo `qrCodeValue` se campos relevantes mudarem. Registrar log.
    *   `DELETE /api/assets/:id`: Excluir. Protegido por Admin. Registrar log.
    *   `POST /api/assets/import`: Importar CSV. Input: array de `AssetFormData`. Protegido por Admin. Lógica similar à `handleImportAssets` do frontend, mas verificando `serialNumber` duplicados no DB. Registrar log.

*   **CRUD para `Descriptor` (`descriptor.routes.ts`, etc.):**
    *   `GET /api/descriptors`: Listar.
    *   `POST /api/descriptors`: Criar. Input: `DescriptorFormData`. Gerar ID (UUID). `createdAt`, `updatedAt`. Protegido por Admin. Registrar log.
    *   `PUT /api/descriptors/:id`: Editar. Input: `DescriptorFormData`. `updatedAt`. Protegido por Admin. Registrar log.
    *   `DELETE /api/descriptors/:id`: Excluir. Protegido por Admin. Registrar log.

*   **Leitura para `LogEntry` (`log.routes.ts`, etc.):**
    *   `GET /api/logs`: Listar. Protegido por usuário logado. Permitir filtros (usuário, tipo de ação, data) via query params.

**Regras Gerais para Controllers:**
*   Usar `try-catch` para tratamento de erros.
*   Retornar códigos de status HTTP apropriados (200, 201, 204, 400, 401, 403, 404, 500).
*   Validar dados de entrada.
*   Toda operação de escrita (CUD) deve gerar uma entrada correspondente na tabela `movement_logs` com os dados do usuário autenticado (`req.user`).
*   Gerar IDs únicos para novas entidades (UUID recomendado).

---
**Passo 4: Instruções para Modificação do Frontend**
---
A IA (ou um desenvolvedor humano seguindo estas instruções) precisará modificar o frontend:

1.  **Remover `localStorage` para Dados da Aplicação:**
    *   Os estados em `App.tsx` (`appUsers`, `products`, etc.) não serão mais inicializados ou persistidos via `localStorage`. Eles serão preenchidos por chamadas à API.
    *   O `currentUser` e seu token ainda serão mantidos no `localStorage` após o login para gerenciar a sessão do cliente.

2.  **Criar um Serviço de API (`src/services/api.ts` ou similar):**
    *   Este serviço encapsulará todas as chamadas `fetch` ou `axios` para o backend.
    *   Funções como `login(email, password)`, `fetchUsers()`, `createProduct(data)`, etc.
    *   Automaticamente incluir o JWT do `localStorage` (de `currentUser`) nos headers `Authorization` das requisições protegidas.
    *   Tratar respostas da API e possíveis erros.

3.  **Refatorar `App.tsx` e Páginas:**
    *   **Carregamento de Dados:** Usar `useEffect` para chamar as funções do serviço de API e buscar dados quando os componentes montarem (ou quando `currentUser` mudar, indicando um novo login).
        ```typescript
        // Exemplo em App.tsx ou página relevante
        useEffect(() => {
          if (currentUser) { // Só carrega se logado
            const loadData = async () => {
              try {
                setLoading(true);
                const [usersData, productsData /*, ...outros dados */] = await Promise.all([
                  apiService.fetchAppUsers(),
                  apiService.fetchProducts(),
                  // ...outras chamadas
                ]);
                setAppUsers(usersData);
                setProducts(productsData);
                // ...set outros estados
              } catch (error) {
                console.error("Failed to load data:", error);
                // Tratar erro na UI
              } finally {
                setLoading(false);
              }
            };
            loadData();
          } else {
            // Limpar estados se não houver usuário (logout)
            setAppUsers([]);
            setProducts([]);
            // ...limpar outros estados
          }
        }, [currentUser]); // Dependência no currentUser
        ```
    *   **Operações CRUD:** Modificar as funções `handle...` para chamar os métodos correspondentes do serviço de API. Após uma operação de escrita bem-sucedida, revalidar/recarregar os dados da lista correspondente para refletir as mudanças ou atualizar o estado local com a resposta da API (se ela retornar o item modificado/criado).
    *   **`handleLogin`:** Chamar `apiService.login()`. Se sucesso, salvar o `token` e `user` no `localStorage` e no estado `currentUser`.
    *   **`addLogEntry`:** Esta função no `App.tsx` se tornará menos relevante, pois a maioria dos logs será criada pelo backend. Pode ser mantida para logs puramente do lado do cliente, se houver.

4.  **Tratamento de Estado de Carregamento e Erros de API:**
    *   Implementar feedback visual para o usuário durante as chamadas de API (spinners, mensagens de carregamento).
    *   Exibir mensagens de erro retornadas pela API.

---
**Passo 5: Instruções para Configuração do Ambiente de Execução (Servidor Linux)**
---

1.  **Backend:**
    *   Clonar/copiar o projeto backend para o servidor Linux.
    *   Instalar Node.js e npm/yarn.
    *   Rodar `npm install` (ou `yarn`).
    *   Criar o arquivo `.env` com `PORT` (ex: 3001) e `JWT_SECRET` (uma string longa e aleatória).
    *   Rodar `npm run build` (se usando TypeScript) e depois `npm start` (ou usar `pm2` para gerenciamento de processo em produção).
    *   Garantir que o arquivo `insumos_ti.db` tenha permissões de escrita para o usuário que executa o processo Node.js.

2.  **Frontend:**
    *   Executar `npm run build` no projeto frontend para gerar os arquivos estáticos.
    *   Copiar o conteúdo da pasta `build` (ou `dist`) para o servidor Linux (ex: `/var/www/html/insumos-ti`).

3.  **Servidor Web (Nginx recomendado):**
    *   Instalar Nginx.
    *   Configurar o Nginx para:
        *   Servir os arquivos estáticos do frontend (da pasta `/var/www/html/insumos-ti`).
        *   Atuar como um **reverse proxy** para as requisições `/api/*`, encaminhando-as para o servidor backend Node.js (ex: `http://localhost:3001`).

    **Exemplo de Bloco de Servidor Nginx:**
    ```nginx
    server {
        listen 80; # Porta de acesso na rede local
        server_name SEU_IP_DE_REDE_LOCAL_OU_HOSTNAME;

        root /var/www/html/insumos-ti; # Caminho para os arquivos de build do frontend
        index index.html;

        location / {
            try_files $uri $uri/ /index.html; # Para React Router funcionar
        }

        location /api/ {
            proxy_pass http://localhost:3001/; # Encaminha para o backend Node.js
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

---

Este guia é abrangente e deve fornecer à IA as informações necessárias para projetar e implementar o backend. A IA precisará gerar o código para cada um dos controllers, models, rotas, e a lógica de banco de dados, além de garantir a correta implementação da autenticação e das regras de negócio identificadas.

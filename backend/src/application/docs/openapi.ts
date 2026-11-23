// Documentação da API no formato OpenAPI 3, mostrada pelo Swagger em /api/docs (server.ts).
// Escrita à mão a partir de docs/api.md: criou ou mudou uma rota, atualize os dois.
// Para testar rotas com login: chame POST /auth/login aqui mesmo; o cookie vale para as próximas chamadas.

const erro = (descricao: string) => ({
  description: descricao,
  content: { "application/json": { schema: { $ref: "#/components/schemas/ApiError" } } },
})

const json = (ref: string, descricao = "Sucesso") => ({
  description: descricao,
  content: { "application/json": { schema: { $ref: `#/components/schemas/${ref}` } } },
})

const lista = (ref: string, descricao = "Sucesso") => ({
  description: descricao,
  content: { "application/json": { schema: { type: "array", items: { $ref: `#/components/schemas/${ref}` } } } },
})

const paginado = (ref: string) => ({
  description: "Página da lista",
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          items: { type: "array", items: { $ref: `#/components/schemas/${ref}` } },
          page: { type: "integer", example: 1 },
          pageSize: { type: "integer", example: 12 },
          total: { type: "integer", example: 11 },
        },
      },
    },
  },
})

const corpo = (ref: string) => ({
  required: true,
  content: { "application/json": { schema: { $ref: `#/components/schemas/${ref}` } } },
})

const idNoCaminho = (exemplo: string) => ({ name: "id", in: "path", required: true, schema: { type: "string" }, example: exemplo })
const naQuery = (name: string, descricao: string, exemplo?: string | number) => ({
  name, in: "query", required: false, description: descricao, schema: { type: typeof exemplo === "number" ? "number" : "string" }, example: exemplo,
})
const paginacao = [naQuery("page", "Página, começa em 1", 1), naQuery("pageSize", "Itens por página (padrão 12, máximo 100)", 12)]

const comLogin = [{ cookieAuth: [] }]
const semLogin = erro("Sem login (UNAUTHORIZED)")
const perfilErrado = erro("Perfil sem permissão (FORBIDDEN)")
const invalido = erro("Dados inválidos (VALIDATION)")
const naoEncontrado = erro("Não encontrado (NOT_FOUND)")
const conflito = erro("Conflito com o estado atual (CONFLICT)")

export const openapi = {
  openapi: "3.0.3",
  info: {
    title: "API do Origem",
    version: "1.0.0",
    description:
      "Marketplace do artesanato de Pernambuco (Avaliação 2). Contrato completo em docs/api.md.\n\n" +
      "Erros sempre no formato `{ error: { code, message } }`. Rotas com cadeado exigem login: " +
      "chame `POST /auth/login` (contas de teste com a senha `Origem@123`) e o cookie `token` passa a ser enviado.",
  },
  servers: [{ url: "/api" }],
  tags: [
    { name: "Autenticação e cadastro" },
    { name: "Vitrine", description: "Rotas públicas" },
    { name: "Pedidos e avaliações" },
    { name: "Minha conta", description: "Usuário logado (comprador ou artesão)" },
    { name: "Artesão", description: "Só para o perfil artesao" },
    { name: "Admin", description: "Só para o perfil admin" },
  ],
  paths: {
    // ---------- Autenticação e cadastro ----------
    "/usuarios": {
      post: {
        tags: ["Autenticação e cadastro"],
        summary: "Cadastro de comprador",
        requestBody: corpo("CadastroCompradorInput"),
        responses: { 201: json("Usuario", "Conta criada (não faz login)"), 400: invalido, 409: erro("E-mail já cadastrado (CONFLICT)") },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Autenticação e cadastro"],
        summary: "Entrar",
        description: "Devolve o usuário e grava o cookie httpOnly `token`.",
        requestBody: corpo("LoginInput"),
        responses: { 200: json("Usuario"), 400: invalido, 401: erro("E-mail ou senha incorretos"), 403: erro("Conta suspensa") },
      },
    },
    "/auth/logout": {
      post: { tags: ["Autenticação e cadastro"], summary: "Sair (apaga o cookie)", responses: { 204: { description: "Saiu" } } },
    },
    "/auth/me": {
      get: { tags: ["Autenticação e cadastro"], summary: "Usuário logado", security: comLogin, responses: { 200: json("Usuario"), 401: semLogin } },
    },

    // ---------- Vitrine ----------
    "/produtos": {
      get: {
        tags: ["Vitrine"],
        summary: "Peças publicadas, com filtros",
        parameters: [
          naQuery("busca", "Texto; ignora acentos e maiúsculas", "ceramica"),
          naQuery("categoria", "Id da categoria", "ceramica-barro"),
          naQuery("tecnica", "Id da técnica", "modelagem-manual"),
          naQuery("material", "Id do material", "barro"),
          naQuery("regiao", "Id da região", "zona-da-mata"),
          naQuery("artesaoId", "Peças de um artesão", "a1"),
          naQuery("precoMin", "Preço mínimo", 50),
          naQuery("precoMax", "Preço máximo", 300),
          naQuery("disponivel", "`sim` para só peças com estoque", "sim"),
          naQuery("ordenar", "relevancia (padrão), menor_preco, maior_preco ou recentes", "menor_preco"),
          ...paginacao,
        ],
        responses: { 200: paginado("Produto") },
      },
    },
    "/produtos/{id}": {
      get: { tags: ["Vitrine"], summary: "Detalhe da peça", parameters: [idNoCaminho("p1")], responses: { 200: json("Produto"), 404: naoEncontrado } },
    },
    "/produtos/{id}/relacionados": {
      get: { tags: ["Vitrine"], summary: "4 peças parecidas", parameters: [idNoCaminho("p1")], responses: { 200: lista("Produto"), 404: naoEncontrado } },
    },
    "/filtros": {
      get: { tags: ["Vitrine"], summary: "Opções dos filtros (categorias, técnicas, materiais e regiões)", responses: { 200: json("OpcoesFiltro") } },
    },
    "/artesaos": {
      get: {
        tags: ["Vitrine"],
        summary: "Artesãos publicados",
        parameters: [
          naQuery("busca", "Nome, cidade ou ofício", "barro"),
          naQuery("regiao", "Id da região", "agreste"),
          naQuery("categoria", "Id da categoria", "tecidos-bordados"),
          naQuery("tecnica", "Id da técnica", "renda"),
          ...paginacao,
        ],
        responses: { 200: paginado("Artesao") },
      },
    },
    "/artesaos/{id}": {
      get: { tags: ["Vitrine"], summary: "Perfil público do artesão", parameters: [idNoCaminho("a1")], responses: { 200: json("Artesao"), 404: naoEncontrado } },
    },
    "/frete": {
      get: {
        tags: ["Vitrine"],
        summary: "Opções de frete (simulação)",
        parameters: [{ name: "cep", in: "query", required: true, schema: { type: "string" }, example: "50030170" }],
        responses: { 200: lista("OpcaoFrete"), 400: erro("CEP sem 8 números (VALIDATION)") },
      },
    },

    // ---------- Pedidos e avaliações ----------
    "/pedidos": {
      post: {
        tags: ["Pedidos e avaliações"],
        summary: "Finalizar a compra",
        description: "Aberta a visitantes; com login, o pedido fica ligado à conta. Baixa o estoque.",
        requestBody: corpo("NovoPedidoInput"),
        responses: { 201: json("Pedido", "Pedido criado"), 400: invalido, 404: naoEncontrado, 409: erro("Sem estoque (OUT_OF_STOCK)") },
      },
    },
    "/pedidos/{id}": {
      patch: {
        tags: ["Pedidos e avaliações"],
        summary: "Cancelar pedido",
        description: "Só o dono (ou o admin), e só antes do envio. Devolve as peças ao estoque.",
        security: comLogin,
        parameters: [idNoCaminho("10495")],
        requestBody: corpo("CancelarPedidoInput"),
        responses: { 200: json("Pedido"), 400: invalido, 401: semLogin, 403: perfilErrado, 404: naoEncontrado, 409: conflito },
      },
    },
    "/avaliacoes": {
      post: {
        tags: ["Pedidos e avaliações"],
        summary: "Avaliar pedido entregue",
        security: comLogin,
        requestBody: corpo("AvaliacaoInput"),
        responses: { 201: json("Avaliacao"), 400: invalido, 401: semLogin, 403: perfilErrado, 404: naoEncontrado, 409: conflito },
      },
    },

    // ---------- Minha conta ----------
    "/minha-conta": {
      get: { tags: ["Minha conta"], summary: "Dados do usuário logado", security: comLogin, responses: { 200: json("MinhaConta"), 401: semLogin } },
    },
    "/minha-conta/pedidos": {
      get: { tags: ["Minha conta"], summary: "Meus pedidos", security: comLogin, responses: { 200: lista("Pedido"), 401: semLogin } },
    },

    // ---------- Artesão ----------
    "/minha-conta/produtos": {
      get: {
        tags: ["Artesão"],
        summary: "Todas as peças do artesão, em qualquer status",
        security: comLogin,
        responses: { 200: lista("Produto"), 401: semLogin, 403: perfilErrado },
      },
      post: {
        tags: ["Artesão"],
        summary: "Cadastrar peça",
        description: "`enviarParaAnalise: true` manda para a curadoria (`emAnalise`); `false` salva como `rascunho`. As fotos ainda não são enviadas.",
        security: comLogin,
        requestBody: corpo("ProdutoInput"),
        responses: { 201: json("Produto", "Peça criada"), 400: invalido, 401: semLogin, 403: perfilErrado },
      },
    },
    "/minha-conta/produtos/{id}": {
      patch: {
        tags: ["Artesão"],
        summary: "Mudar estoque e/ou esconder e mostrar na vitrine",
        security: comLogin,
        parameters: [idNoCaminho("p1")],
        requestBody: corpo("AtualizarEstoqueInput"),
        responses: { 200: json("Produto"), 400: invalido, 401: semLogin, 403: perfilErrado, 404: naoEncontrado, 409: conflito },
      },
      put: {
        tags: ["Artesão"],
        summary: "Editar peça",
        description: "Peça publicada ou escondida continua como está (não volta para a curadoria nem para rascunho). Peça em rascunho ou em análise segue `enviarParaAnalise`.",
        security: comLogin,
        parameters: [idNoCaminho("p1")],
        requestBody: corpo("ProdutoInput"),
        responses: { 200: json("Produto"), 400: invalido, 401: semLogin, 403: perfilErrado, 404: naoEncontrado, 409: erro("Peça vendida (CONFLICT)") },
      },
      delete: {
        tags: ["Artesão"],
        summary: "Excluir peça",
        description: "Só peças que nunca entraram em um pedido.",
        security: comLogin,
        parameters: [idNoCaminho("p1")],
        responses: { 204: { description: "Excluída" }, 401: semLogin, 403: perfilErrado, 404: naoEncontrado, 409: erro("Peça já vendida (CONFLICT)") },
      },
    },
    "/minha-conta/resumo": {
      get: {
        tags: ["Artesão"],
        summary: "Números do catálogo e do estoque",
        security: comLogin,
        responses: { 200: json("ResumoPainelArtesao"), 401: semLogin, 403: perfilErrado },
      },
    },
    "/minha-conta/perfil": {
      get: {
        tags: ["Artesão"],
        summary: "Perfil do artesão logado",
        security: comLogin,
        responses: { 200: json("PerfilArtesao"), 401: semLogin, 403: perfilErrado, 404: naoEncontrado },
      },
      put: {
        tags: ["Artesão"],
        summary: "Salvar o perfil",
        security: comLogin,
        requestBody: corpo("PerfilArtesaoInput"),
        responses: { 200: json("PerfilArtesao"), 400: invalido, 401: semLogin, 403: perfilErrado, 404: naoEncontrado },
      },
    },

    // ---------- Admin ----------
    "/admin/painel": {
      get: {
        tags: ["Admin"],
        summary: "Tela inicial do administrador",
        security: comLogin,
        responses: { 200: json("PainelAdmin"), 401: semLogin, 403: perfilErrado },
      },
    },
  },
  components: {
    securitySchemes: {
      cookieAuth: { type: "apiKey", in: "cookie", name: "token", description: "Gravado por POST /auth/login" },
    },
    schemas: {
      ApiError: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: { code: { type: "string", example: "VALIDATION" }, message: { type: "string", example: "Informe o nome da peça." } },
          },
        },
      },
      Usuario: {
        type: "object",
        properties: {
          id: { type: "string", example: "u1" },
          nome: { type: "string", example: "Ana Beatriz Souza" },
          email: { type: "string", example: "ana.beatriz@email.com" },
          perfil: { type: "string", enum: ["comprador", "artesao", "admin"] },
          status: { type: "string", enum: ["ativo", "suspenso"] },
          cidade: { type: "string", example: "Recife/PE" },
          criadoEm: { type: "string", format: "date-time" },
        },
      },
      CadastroCompradorInput: {
        type: "object",
        required: ["nome", "email", "senha"],
        properties: { nome: { type: "string", example: "Ana Beatriz Souza" }, email: { type: "string", example: "nova@email.com" }, senha: { type: "string", minLength: 8, example: "minhasenha" } },
      },
      LoginInput: {
        type: "object",
        required: ["email", "senha"],
        properties: { email: { type: "string", example: "joaozinho@email.com" }, senha: { type: "string", example: "Origem@123" } },
      },
      Produto: {
        type: "object",
        properties: {
          id: { type: "string", example: "p1" },
          titulo: { type: "string", example: "Jarro Tradicional" },
          artesaoId: { type: "string", example: "a1" },
          artesaoNome: { type: "string", example: "Mestre Joãozinho" },
          cidade: { type: "string", example: "Tracunhaém" },
          tags: { type: "array", items: { type: "string" }, example: ["Peça única", "Barro"] },
          medidas: { type: "string", example: "15 × 27 × 15cm" },
          preco: { type: "number", example: 167.9 },
          imagemUrl: { type: "string" },
          imagens: { type: "array", items: { type: "string" } },
          categoria: { type: "string", example: "ceramica-barro" },
          tecnica: { type: "string", example: "modelagem-manual" },
          material: { type: "string", example: "barro" },
          regiao: { type: "string", example: "zona-da-mata" },
          estoque: { type: "integer", example: 1 },
          pecaUnica: { type: "boolean" },
          status: { type: "string", enum: ["publicado", "emAnalise", "rascunho", "indisponivel", "vendida"] },
          descricao: { type: "string" },
          cuidados: { type: "string" },
          criadoEm: { type: "string", format: "date-time" },
          peso: { type: "string", example: "1,2", description: "Opcional" },
          prazoPostagem: { type: "string", enum: ["1", "3", "7"], description: "Opcional" },
          embalagem: { type: "string", enum: ["caixa", "envelope", "tubo"], description: "Opcional" },
        },
      },
      ProdutoInput: {
        type: "object",
        required: ["titulo", "categoria", "tecnica", "material", "prazoPostagem", "embalagem", "estoque", "preco"],
        properties: {
          titulo: { type: "string", example: "Moringa Azul" },
          categoria: { type: "string", example: "ceramica-barro" },
          descricao: { type: "string", example: "Moringa feita à mão em Tracunhaém." },
          material: { type: "string", example: "barro" },
          tecnica: { type: "string", example: "modelagem-manual" },
          altura: { type: "string", example: "20" },
          largura: { type: "string", example: "12" },
          profundidade: { type: "string", example: "12" },
          peso: { type: "string", example: "1,2" },
          pecaUnica: { type: "boolean", example: false },
          estoque: { type: "integer", example: 3 },
          preco: { type: "number", example: 89.9 },
          prazoPostagem: { type: "string", enum: ["1", "3", "7"], example: "3" },
          embalagem: { type: "string", enum: ["caixa", "envelope", "tubo"], example: "caixa" },
          cuidadosEnvio: { type: "string", example: "Peça frágil." },
          enviarParaAnalise: { type: "boolean", example: true, description: "false = rascunho" },
        },
      },
      AtualizarEstoqueInput: {
        type: "object",
        properties: { estoque: { type: "integer", example: 5 }, status: { type: "string", enum: ["publicado", "indisponivel"] } },
      },
      OpcaoFiltro: { type: "object", properties: { value: { type: "string" }, label: { type: "string" } } },
      OpcoesFiltro: {
        type: "object",
        properties: {
          categorias: { type: "array", items: { $ref: "#/components/schemas/OpcaoFiltro" } },
          tecnicas: { type: "array", items: { $ref: "#/components/schemas/OpcaoFiltro" } },
          materiais: { type: "array", items: { $ref: "#/components/schemas/OpcaoFiltro" } },
          regioes: { type: "array", items: { $ref: "#/components/schemas/OpcaoFiltro" } },
        },
      },
      Artesao: {
        type: "object",
        properties: {
          id: { type: "string", example: "a1" },
          nome: { type: "string", example: "Mestre Joãozinho" },
          oficio: { type: "string", example: "Ceramista" },
          cidade: { type: "string", example: "Tracunhaém" },
          estado: { type: "string", example: "PE" },
          regiao: { type: "string", example: "zona-da-mata" },
          bio: { type: "string" },
          historia: { type: "string" },
          citacao: { type: "string" },
          trabalho: { type: "string", description: "Opcional" },
          origemTrabalho: { type: "string", description: "Opcional" },
          citacaoOrigem: { type: "string", description: "Opcional" },
          gostaDeFazer: { type: "string", description: "Opcional" },
          fotoUrl: { type: "string" },
          tecnicas: { type: "array", items: { type: "string" }, example: ["Cerâmica", "Modelagem manual"] },
          categorias: { type: "array", items: { type: "string" }, example: ["ceramica-barro"] },
          totalProdutos: { type: "integer", example: 6 },
          email: { type: "string" },
          status: { type: "string", enum: ["publicado", "emAnalise", "ajustesSolicitados", "indisponivel"] },
          criadoEm: { type: "string", format: "date-time" },
        },
      },
      PerfilArtesao: {
        allOf: [
          { $ref: "#/components/schemas/Artesao" },
          {
            type: "object",
            properties: {
              telefone: { type: "string", example: "(81) 98888-7777" },
              tempoAtuacao: { type: "string", enum: ["", "menos-1", "1-3", "3-10", "mais-10"] },
            },
          },
        ],
      },
      PerfilArtesaoInput: {
        type: "object",
        required: ["nome", "cidade", "estado", "historia", "categorias"],
        properties: {
          nome: { type: "string", example: "Mestre Joãozinho" },
          cidade: { type: "string", example: "Tracunhaém" },
          estado: { type: "string", example: "PE" },
          telefone: { type: "string", example: "(81) 98888-7777" },
          historia: { type: "string", example: "Aprendi com os mais velhos de Tracunhaém." },
          trabalho: { type: "string" },
          origemTrabalho: { type: "string" },
          gostaDeFazer: { type: "string" },
          tempoAtuacao: { type: "string", enum: ["", "menos-1", "1-3", "3-10", "mais-10"], example: "mais-10" },
          categorias: { type: "array", items: { type: "string" }, example: ["ceramica-barro"] },
          tecnicas: { type: "array", items: { type: "string" }, example: ["Modelagem manual"] },
        },
      },
      ResumoPainelArtesao: {
        type: "object",
        properties: {
          catalogo: {
            type: "object",
            properties: { publicadas: { type: "integer" }, emAnalise: { type: "integer" }, vendidas: { type: "integer" }, indisponiveis: { type: "integer" } },
          },
          estoque: {
            type: "object",
            properties: { disponiveis: { type: "integer" }, baixoEstoque: { type: "integer" }, esgotadas: { type: "integer" } },
          },
        },
      },
      OpcaoFrete: {
        type: "object",
        properties: {
          modalidade: { type: "string", enum: ["pac", "sedex"] },
          nome: { type: "string", example: "PAC" },
          valor: { type: "number", example: 18.9 },
          prazo: { type: "string", example: "6 a 8 dias úteis" },
        },
      },
      Endereco: {
        type: "object",
        properties: {
          cep: { type: "string", example: "50030-170" },
          rua: { type: "string", example: "Rua do Bom Jesus" },
          numero: { type: "string", example: "123" },
          complemento: { type: "string" },
          bairro: { type: "string", example: "Recife Antigo" },
          cidade: { type: "string", example: "Recife" },
          estado: { type: "string", example: "PE" },
        },
      },
      NovoPedidoInput: {
        type: "object",
        required: ["itens", "comprador", "endereco", "frete", "pagamento"],
        properties: {
          itens: {
            type: "array",
            items: { type: "object", properties: { produtoId: { type: "string", example: "p10" }, quantidade: { type: "integer", example: 1 } } },
          },
          comprador: {
            type: "object",
            properties: {
              nome: { type: "string", example: "Ana Beatriz Souza" },
              cpf: { type: "string", example: "123.456.789-00" },
              email: { type: "string", example: "ana.beatriz@email.com" },
              telefone: { type: "string", example: "(81) 99876-5432" },
            },
          },
          endereco: { $ref: "#/components/schemas/Endereco" },
          frete: { $ref: "#/components/schemas/OpcaoFrete" },
          pagamento: { type: "string", enum: ["cartao", "pix", "boleto"], example: "pix" },
          parcelas: { type: "integer", minimum: 1, maximum: 12, example: 1 },
        },
      },
      Pedido: {
        type: "object",
        properties: {
          id: { type: "string", example: "10496" },
          codigo: { type: "string", example: "#10496" },
          status: { type: "string", enum: ["processando", "emSeparacao", "enviado", "entregue", "cancelado"] },
          criadoEm: { type: "string", format: "date-time" },
          itens: {
            type: "array",
            items: {
              type: "object",
              properties: {
                produtoId: { type: "string" },
                titulo: { type: "string" },
                imagemUrl: { type: "string" },
                artesaoNome: { type: "string" },
                precoUnitario: { type: "number" },
                quantidade: { type: "integer" },
              },
            },
          },
          subtotal: { type: "number" },
          frete: { $ref: "#/components/schemas/OpcaoFrete" },
          total: { type: "number" },
          endereco: { $ref: "#/components/schemas/Endereco" },
          pagamento: { type: "string", enum: ["cartao", "pix", "boleto"] },
          parcelas: { type: "integer" },
          eventos: { type: "array", items: { type: "object", properties: { titulo: { type: "string" }, data: { type: "string", format: "date-time" } } } },
          motivoCancelamento: { type: "string", description: "Só nos pedidos cancelados" },
          avaliado: { type: "boolean" },
        },
      },
      CancelarPedidoInput: {
        type: "object",
        required: ["status", "motivo"],
        properties: {
          status: { type: "string", enum: ["cancelado"] },
          motivo: { type: "string", example: "Comprei por engano" },
          observacao: { type: "string" },
        },
      },
      AvaliacaoInput: {
        type: "object",
        required: ["pedidoId", "nota"],
        properties: {
          pedidoId: { type: "string", example: "10402" },
          nota: { type: "integer", minimum: 1, maximum: 5, example: 5 },
          comentario: { type: "string", example: "Peça linda!" },
          notas: { type: "object", additionalProperties: { type: "integer" }, example: { produto: 5, embalagem: 4 } },
        },
      },
      Avaliacao: {
        allOf: [
          { $ref: "#/components/schemas/AvaliacaoInput" },
          { type: "object", properties: { id: { type: "string" }, criadoEm: { type: "string", format: "date-time" } } },
        ],
      },
      MinhaConta: {
        allOf: [
          { $ref: "#/components/schemas/Usuario" },
          {
            type: "object",
            properties: {
              cpf: { type: "string", example: "***.456.789-**" },
              telefone: { type: "string" },
              endereco: { $ref: "#/components/schemas/Endereco" },
              formasPagamento: { type: "array", items: { type: "object", properties: { titulo: { type: "string" }, detalhe: { type: "string" } } } },
            },
          },
        ],
      },
      PainelAdmin: {
        type: "object",
        properties: {
          resumo: {
            type: "object",
            properties: {
              pedidosHoje: { type: "integer" },
              vendasMes: { type: "number" },
              artesaosAtivos: { type: "integer" },
              produtosPublicados: { type: "integer" },
              clientes: { type: "integer" },
            },
          },
          pendencias: {
            type: "array",
            items: { type: "object", properties: { id: { type: "string" }, titulo: { type: "string" }, quantidade: { type: "integer" }, href: { type: "string" } } },
          },
          notificacoes: { type: "array", items: { type: "object", properties: { id: { type: "string" }, titulo: { type: "string" }, descricao: { type: "string" } } } },
          atividades: {
            type: "array",
            items: { type: "object", properties: { id: { type: "string" }, autor: { type: "string" }, descricao: { type: "string" }, data: { type: "string", format: "date-time" } } },
          },
        },
      },
    },
  },
}

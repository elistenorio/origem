import { OUTRA_TECNICA } from "@/constants/artesao"
import { formularioParaPerfil, perfilParaFormulario, validarPerfil } from "@/utils/perfilArtesao"
import { formularioPerfilFake, perfilArtesaoFake } from "../helpers/fixtures"

describe("validarPerfil (formulário Meu perfil)", () => {
  it("com os dados preenchidos não há erros", () => {
    expect(validarPerfil(formularioPerfilFake())).toEqual({})
  })

  it("nome, cidade, história e área de atuação são obrigatórios", () => {
    const erros = validarPerfil(formularioPerfilFake({ nome: "", cidade: " ", historia: "", categorias: [] }))

    expect(erros).toEqual({
      nome: "Informe o nome que vai aparecer no Origem.",
      cidade: "Informe sua cidade.",
      historia: "Conte um pouco da sua história.",
      categorias: "Escolha sua área de atuação.",
    })
  })

  it("o estado precisa ter 2 letras e o telefone, quando informado, precisa ter DDD", () => {
    const erros = validarPerfil(formularioPerfilFake({ estado: "Pernambuco", telefone: "99999-0000" }))

    expect(erros).toEqual({ estado: "Use 2 letras (ex.: PE).", telefone: "Informe o telefone com DDD." })
  })

  it("o telefone é opcional", () => {
    expect(validarPerfil(formularioPerfilFake({ telefone: "" }))).toEqual({})
  })
})

describe("técnicas do perfil: lista e \"Outra\"", () => {
  it("ao salvar, as técnicas digitadas em \"Outra\" entram na lista no lugar da opção \"Outra\"", () => {
    const perfil = formularioParaPerfil(
      formularioPerfilFake({ tecnicasMarcadas: ["Modelagem manual", OUTRA_TECNICA], outrasTecnicas: "Bordado ponto cruz, , Renascença " }),
    )

    expect(perfil.tecnicas).toEqual(["Modelagem manual", "Bordado ponto cruz", "Renascença"])
  })

  it("sem \"Outra\" marcada, o texto digitado em outras técnicas é ignorado", () => {
    const perfil = formularioParaPerfil(formularioPerfilFake({ tecnicasMarcadas: ["Torneamento"], outrasTecnicas: "Renascença" }))

    expect(perfil.tecnicas).toEqual(["Torneamento"])
  })

  it("ao abrir o perfil, técnicas fora da lista voltam para o campo \"Outra\"", () => {
    const formulario = perfilParaFormulario(perfilArtesaoFake({ tecnicas: ["Modelagem manual", "Renascença"] }))

    expect(formulario.tecnicasMarcadas).toEqual(["Modelagem manual", OUTRA_TECNICA])
    expect(formulario.outrasTecnicas).toBe("Renascença")
  })
})

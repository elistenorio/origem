import { redis } from "./redis"

// Cache de GET /produtos e GET /produtos/:id.
//
// Como funciona:
// - A primeira consulta busca no banco e guarda a resposta no Redis ("MISS").
// - As seguintes, com os mesmos filtros, saem do Redis, sem ir ao banco ("HIT").
// - Cada resposta guardada expira sozinha em 5 minutos.
//
// Como o cache é "zerado" quando uma peça muda (compra, cancelamento, estoque...):
// todas as chaves levam um número de versão ("produtos:v3:lista:..."). Para zerar, basta somar 1
// na versão: as consultas seguintes procuram chaves novas ("produtos:v4:..."), que ainda não existem,
// e vão ao banco. As chaves antigas ficam sem uso e expiram sozinhas. É uma operação só, sem apagar
// chave por chave.

const VALIDADE_SEGUNDOS = 5 * 60
const CHAVE_VERSAO = "produtos:versao"

/** De onde veio a resposta: do cache (HIT) ou do banco (MISS). Vai no cabeçalho X-Cache. */
export type OrigemCache = "HIT" | "MISS"

export type ComCache<T> = { dados: T; cache: OrigemCache }

export const produtosCache = {
  /**
   * Devolve o valor guardado para (tipo + parâmetros) ou, se não houver, chama `buscar`, guarda e devolve.
   * Erros de `buscar` (ex.: 404) passam direto e não são guardados.
   */
  async comCache<T>(tipo: "lista" | "detalhe", parametros: string, buscar: () => Promise<T>): Promise<ComCache<T>> {
    const versao = (await redis.ler(CHAVE_VERSAO)) ?? "0"
    const chave = `produtos:v${versao}:${tipo}:${parametros}`

    const guardado = await redis.lerJson<T>(chave)
    if (guardado !== null) return { dados: guardado, cache: "HIT" }

    const dados = await buscar()
    await redis.gravarJson(chave, dados, VALIDADE_SEGUNDOS)
    return { dados, cache: "MISS" }
  },

  /** Zera o cache das peças. Chamar sempre que uma peça mudar (estoque, status, dados, artesão). */
  async invalidar(): Promise<void> {
    await redis.incrementar(CHAVE_VERSAO)
  },
}

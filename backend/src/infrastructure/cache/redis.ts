import { createClient } from "redis"
import { env } from "../../shared/env"

// Conexão única com o Redis, usada pelo cache.
//
// Regra principal: o cache é OPCIONAL. Sem REDIS_URL, ou com o Redis fora do ar, toda operação
// devolve null (como se não houvesse nada guardado) e a API segue buscando no banco.
// Nunca deixamos uma requisição esperar ou falhar por causa do cache.

type ClienteRedis = ReturnType<typeof createClient>

const LIMITE_MS = 1000 // tempo máximo de uma operação no Redis antes de desistir

let cliente: ClienteRedis | null = null
let ultimoAviso = 0

// Avisa no log no máximo uma vez por minuto (com o Redis fora do ar, o erro se repetiria a cada tentativa).
function avisar(mensagem: string, erro: unknown) {
  const agora = Date.now()
  if (agora - ultimoAviso < 60_000) return
  ultimoAviso = agora
  console.warn(`[cache] ${mensagem}:`, erro instanceof Error ? erro.message : erro)
}

/** Abre a conexão (uma vez só). Chamado ao subir o servidor; sem REDIS_URL, não faz nada. */
export function iniciarCache(): ClienteRedis | null {
  if (!env.REDIS_URL) return null
  if (cliente) return cliente

  cliente = createClient({
    url: env.REDIS_URL,
    // Sem Redis, o comando falha na hora em vez de ficar numa fila esperando a conexão voltar.
    disableOfflineQueue: true,
    socket: {
      connectTimeout: 2000,
      // Se cair, tenta reconectar sozinho, com intervalos cada vez maiores (até 10 s).
      reconnectStrategy: (tentativas) => Math.min(tentativas * 500, 10_000),
    },
  })
  cliente.on("ready", () => console.log("[cache] Redis conectado"))
  cliente.on("error", (erro) => avisar("Redis indisponível, seguindo sem cache", erro))
  cliente.connect().catch((erro) => avisar("não foi possível conectar ao Redis", erro))
  return cliente
}

// Executa uma operação no Redis; se ele não estiver pronto, demorar ou der erro, devolve null.
async function executar<T>(operacao: (c: ClienteRedis) => Promise<T>): Promise<T | null> {
  const c = iniciarCache()
  if (!c?.isReady) return null

  let relogio: NodeJS.Timeout | undefined
  const limite = new Promise<never>((_, rejeitar) => {
    relogio = setTimeout(() => rejeitar(new Error(`sem resposta em ${LIMITE_MS} ms`)), LIMITE_MS)
  })
  try {
    return await Promise.race([operacao(c), limite])
  } catch (erro) {
    avisar("operação no Redis falhou", erro)
    return null
  } finally {
    clearTimeout(relogio)
  }
}

export const redis = {
  ler(chave: string): Promise<string | null> {
    return executar((c) => c.get(chave))
  },

  /** Lê um valor guardado como JSON. Atenção: datas voltam como texto ISO (o JSON não tem Date). */
  async lerJson<T>(chave: string): Promise<T | null> {
    const texto = await redis.ler(chave)
    return texto === null ? null : (JSON.parse(texto) as T)
  },

  /** Guarda um valor como JSON, que expira sozinho depois de `segundos`. */
  async gravarJson(chave: string, valor: unknown, segundos: number): Promise<void> {
    await executar((c) => c.set(chave, JSON.stringify(valor), { EX: segundos }))
  },

  async incrementar(chave: string): Promise<void> {
    await executar((c) => c.incr(chave))
  },
}

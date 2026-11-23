// Os testes rodam no Node, sem navegador. O carrinho usa o persist do Zustand, que grava em
// window.localStorage; este localStorage em memória faz o persist funcionar igual ao navegador.
const dados = new Map<string, string>()

const localStorageEmMemoria: Storage = {
  get length() {
    return dados.size
  },
  clear: () => dados.clear(),
  getItem: (chave) => dados.get(chave) ?? null,
  key: (indice) => [...dados.keys()][indice] ?? null,
  removeItem: (chave) => {
    dados.delete(chave)
  },
  setItem: (chave, valor) => {
    dados.set(chave, String(valor))
  },
}

// Só o localStorage: o resto do window não existe no Node e os testes não precisam dele.
Object.defineProperty(globalThis, "localStorage", { value: localStorageEmMemoria, configurable: true })
Object.defineProperty(globalThis, "window", { value: { localStorage: localStorageEmMemoria }, configurable: true })

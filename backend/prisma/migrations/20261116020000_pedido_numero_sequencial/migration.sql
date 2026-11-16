-- Número do pedido gerado pelo banco, em sequência ("10496", "10497"...), sem risco de dois pedidos
-- receberem o mesmo número. O código exibido ("#10496") passa a ser montado na resposta da API.
CREATE SEQUENCE IF NOT EXISTS "pedido_numero_seq";
ALTER SEQUENCE "pedido_numero_seq" OWNED BY "Pedido"."id";

-- Continua a partir do maior número que já existe (os pedidos do seed vão até 10495).
SELECT setval(
  'pedido_numero_seq',
  GREATEST(10495, (SELECT COALESCE(MAX("id"::bigint), 0) FROM "Pedido" WHERE "id" ~ '^[0-9]+$'))
);

ALTER TABLE "Pedido" ALTER COLUMN "id" SET DEFAULT (nextval('pedido_numero_seq'::regclass))::text;

-- O código vira campo calculado ("#" + id).
DROP INDEX "Pedido_codigo_key";
ALTER TABLE "Pedido" DROP COLUMN "codigo";

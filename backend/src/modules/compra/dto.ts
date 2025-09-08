import { z } from "zod";

export const itemCompraSchema = z.object({
  produtoId: z.string().min(1),
  quantidade: z.number().int().positive(),
  // se não vier, o service usa o preço atual do produto
  precoUnit: z.number().positive().nullable().optional(),
});

export const compraCreateSchema = z.object({
  clienteId: z.string().min(1).optional(),
  funcionarioId: z.string().min(1),
  itens: z.array(itemCompraSchema).min(1, "compra deve ter ao menos 1 item"),
});

export type ItemCompraDTO = z.infer<typeof itemCompraSchema>;
export type CompraCreateDTO = z.infer<typeof compraCreateSchema>;
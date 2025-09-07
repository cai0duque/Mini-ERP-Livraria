import { z } from "zod";

export const movimentoCreateSchema = z.object({
  produtoId: z.string().min(1, "produtoId é obrigatório"),
  tipo: z.enum(["ENTRADA_AJUSTE", "SAIDA_VENDA"]),
  quantidade: z.number().int().positive("quantidade deve ser > 0"),
  data: z.coerce.date().optional(), // aceita string Date e converte pra Date
});

export type MovimentoCreateDTO = z.infer<typeof movimentoCreateSchema>;
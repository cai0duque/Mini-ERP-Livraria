import { z } from "zod";

export const produtoCreateSchema = z.object({
  sku: z.string().min(1),
  nome: z.string().min(1),
  tipo: z.enum(["LIVRO", "PAPELARIA"]),
  preco: z.number().nonnegative(),
  estoque: z.number().int().nonnegative().default(0),
  detalhes: z
    .object({
      isbn: z.string().optional(),
      autor: z.string().optional(),
      editora: z.string().optional(),
    })
    .optional(),
});

export const produtoUpdateSchema = produtoCreateSchema.partial();

export type ProdutoCreateDTO = z.infer<typeof produtoCreateSchema>;
export type ProdutoUpdateDTO = z.infer<typeof produtoUpdateSchema>;

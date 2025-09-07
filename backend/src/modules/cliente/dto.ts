import { z } from "zod";

export const clienteCreateSchema = z.object({
  nome: z.string().min(1, "nome é obrigatório"),
  email: z.string().email("email inválido").optional().or(z.literal("").transform(() => undefined)),
  cpf: z.string().min(11, "cpf deve ter 11 dígitos").max(14).optional(),
});

export const clienteUpdateSchema = clienteCreateSchema.partial();

export type ClienteCreateDTO = z.infer<typeof clienteCreateSchema>;
export type ClienteUpdateDTO = z.infer<typeof clienteUpdateSchema>;

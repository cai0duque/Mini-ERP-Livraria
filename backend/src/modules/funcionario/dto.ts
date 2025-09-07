import { z } from "zod";

export const funcionarioCreateSchema = z.object({
  nome: z.string().min(1, "nome é obrigatório"),
  email: z.string().email("email inválido"),
  senha: z.string().min(6, "senha precisa ter ao menos 6 caracteres"),
  papel: z.enum(["GERENTE", "VENDEDOR"]),
});

export const funcionarioUpdateSchema = z.object({
  nome: z.string().min(1).optional(),
  email: z.string().email().optional(),
  senha: z.string().min(6).optional(),
  papel: z.enum(["GERENTE", "VENDEDOR"]).optional(),
});

export type FuncionarioCreateDTO = z.infer<typeof funcionarioCreateSchema>;
export type FuncionarioUpdateDTO = z.infer<typeof funcionarioUpdateSchema>;

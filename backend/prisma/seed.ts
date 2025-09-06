import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash("senha123", 10);

  await prisma.funcionario.upsert({
    where: { email: "gerente@loja.com" },
    update: {},
    create: { nome: "Gerente", email: "gerente@loja.com", senhaHash, papel: "GERENTE" }
  });

  const prod1 = await prisma.produto.upsert({
    where: { sku: "LIV-0001" },
    update: {},
    create: { sku: "LIV-0001", nome: "Clean Code", tipo: "LIVRO", preco: 149.90, estoque: 8 }
  });

  await prisma.livroDetalhe.upsert({
    where: { produtoId: prod1.id },
    update: {},
    create: { produtoId: prod1.id, isbn: "9780132350884", autor: "Robert C. Martin", editora: "Prentice Hall" }
  });

  await prisma.produto.upsert({
    where: { sku: "PAP-0001" },
    update: {},
    create: { sku: "PAP-0001", nome: "Caderno 96 folhas", tipo: "PAPELARIA", preco: 19.90, estoque: 50 }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

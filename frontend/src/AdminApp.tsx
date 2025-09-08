'use client';

import {
  Admin, Resource, List, Datagrid, TextField, NumberField, DateField,
  Edit, Create, SimpleForm, TextInput, NumberInput, SelectInput,
  ReferenceInput, AutocompleteInput, ArrayInput, SimpleFormIterator,
  PasswordInput,
} from 'react-admin';
import dataProvider from './dataProvider';

// ---------- PRODUTOS ----------
const ProdutoList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="sku" />
      <TextField source="nome" />
      <TextField source="tipo" />
      <TextField source="preco" />
      <NumberField source="estoque" />
      <DateField source="createdAt" showTime />
    </Datagrid>
  </List>
);

const ProdutoEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="sku" />
      <TextInput source="nome" />
      <SelectInput
        source="tipo"
        choices={[
          { id: 'LIVRO', name: 'Livro' },
          { id: 'PAPELARIA', name: 'Papelaria' },
        ]}
      />
      <NumberInput source="preco" />
      <NumberInput source="estoque" />
      <TextInput source="detalhes.isbn" label="ISBN (Livro)" />
      <TextInput source="detalhes.autor" label="Autor (Livro)" />
      <TextInput source="detalhes.editora" label="Editora (Livro)" />
    </SimpleForm>
  </Edit>
);

const ProdutoCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="sku" />
      <TextInput source="nome" />
      <SelectInput
        source="tipo"
        choices={[
          { id: 'LIVRO', name: 'Livro' },
          { id: 'PAPELARIA', name: 'Papelaria' },
        ]}
      />
      <NumberInput source="preco" />
      <NumberInput source="estoque" />
      <TextInput source="detalhes.isbn" label="ISBN (Livro)" />
      <TextInput source="detalhes.autor" label="Autor (Livro)" />
      <TextInput source="detalhes.editora" label="Editora (Livro)" />
    </SimpleForm>
  </Create>
);

// ---------- CLIENTES ----------
const ClienteList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="nome" />
      <TextField source="email" />
      <TextField source="cpf" />
      <DateField source="createdAt" showTime />
    </Datagrid>
  </List>
);

const ClienteEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="nome" />
      <TextInput source="email" />
      <TextInput source="cpf" />
    </SimpleForm>
  </Edit>
);

const ClienteCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="nome" />
      <TextInput source="email" />
      <TextInput source="cpf" />
    </SimpleForm>
  </Create>
);

// ---------- FUNCIONÁRIOS ----------
const FuncList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="nome" />
      <TextField source="email" />
      <TextField source="papel" />
      <DateField source="createdAt" showTime />
    </Datagrid>
  </List>
);

const FuncEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="nome" />
      <TextInput source="email" />
      <SelectInput
        source="papel"
        choices={[
          { id: 'GERENTE', name: 'Gerente' },
          { id: 'VENDEDOR', name: 'Vendedor' },
        ]}
      />
      <PasswordInput source="senha" label="Nova senha (opcional)" />
    </SimpleForm>
  </Edit>
);

const FuncCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="nome" />
      <TextInput source="email" />
      <SelectInput
        source="papel"
        choices={[
          { id: 'GERENTE', name: 'Gerente' },
          { id: 'VENDEDOR', name: 'Vendedor' },
        ]}
      />
      <PasswordInput source="senha" />
    </SimpleForm>
  </Create>
);

// ---------- MOVIMENTOS ----------
const MovList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="produtoId" />
      <TextField source="tipo" />
      <NumberField source="quantidade" />
      <DateField source="data" showTime />
      <TextField source="compraId" />
    </Datagrid>
  </List>
);

const MovCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="produtoId" reference="produtos">
        <AutocompleteInput optionText="nome" />
      </ReferenceInput>
      <SelectInput
        source="tipo"
        choices={[
          { id: 'ENTRADA_AJUSTE', name: 'Entrada (ajuste)' },
          { id: 'SAIDA_VENDA', name: 'Saída (venda)' },
        ]}
      />
      <NumberInput source="quantidade" />
    </SimpleForm>
  </Create>
);

// ---------- COMPRAS (formulário composto) ----------
const CompraList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="cliente.nome" label="Cliente" />
      <TextField source="funcionario.nome" label="Funcionário" />
      <TextField source="total" />
      <DateField source="data" showTime />
    </Datagrid>
  </List>
);

const CompraCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="clienteId" reference="clientes">
        <AutocompleteInput optionText="nome" />
      </ReferenceInput>
      <ReferenceInput source="funcionarioId" reference="funcionarios">
        <AutocompleteInput optionText="nome" />
      </ReferenceInput>
      <ArrayInput source="itens" label="Itens da compra">
        <SimpleFormIterator>
          <ReferenceInput source="produtoId" reference="produtos">
            <AutocompleteInput optionText="nome" />
          </ReferenceInput>
          <NumberInput source="quantidade" />
          <NumberInput source="precoUnit" label="Preço unitário (opcional)" />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Create>
);

export default function AdminApp() {
  // 👇 Cast para evitar briga de generics do RA (nosso provider é agnóstico)
  return (
    <Admin dataProvider={dataProvider as any}>
      <Resource name="produtos" list={ProdutoList} edit={ProdutoEdit} create={ProdutoCreate} />
      <Resource name="clientes" list={ClienteList} edit={ClienteEdit} create={ClienteCreate} />
      <Resource name="funcionarios" list={FuncList} edit={FuncEdit} create={FuncCreate} />
      <Resource name="movimentos" list={MovList} create={MovCreate} />
      <Resource name="compras" list={CompraList} create={CompraCreate} />
    </Admin>
  );
}

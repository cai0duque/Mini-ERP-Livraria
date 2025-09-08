const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

async function http(path: string, method: HttpMethod = "GET", body?: unknown) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let msg = await res.text();
    try { msg = JSON.parse(msg).error || msg; } catch {}
    throw new Error(msg || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return await res.json();
}

const dataProvider = {
  async getList(resource: string) {
    const data = await http(`/${resource}`);
    return { data, total: Array.isArray(data) ? data.length : 0 };
  },
  async getOne(resource: string, params: any) {
    const data = await http(`/${resource}/${params.id}`);
    return { data };
  },
  async create(resource: string, params: any) {
    const data = await http(`/${resource}`, "POST", params.data);
    return { data };
  },
  async update(resource: string, params: any) {
    const data = await http(`/${resource}/${params.id}`, "PUT", params.data);
    return { data };
  },
  async delete(resource: string, params: any) {
    await http(`/${resource}/${params.id}`, "DELETE");
    return { data: { id: params.id } };
  },
  async getMany(resource: string, params: any) {
    const all = await http(`/${resource}`);
    const ids: any[] = params?.ids ?? [];
    return { data: all.filter((r: any) => ids.includes(r.id)) };
  },
  async getManyReference(resource: string/*, _params: any*/) {
    const all = await http(`/${resource}`);
    return { data: all, total: all.length };
  },
  async updateMany() { return { data: [] }; },
  async deleteMany() { return { data: [] }; },
};

export default dataProvider;

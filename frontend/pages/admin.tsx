import dynamic from 'next/dynamic';

// Carrega o painel apenas no client (sem SSR)
const AdminApp = dynamic(() => import('../src/AdminApp'), { ssr: false });

export default function AdminPage() {
  return <AdminApp />;
}

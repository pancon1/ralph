import { isAdmin } from "@/lib/admin/auth";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — Bob.io",
};

export default async function AdminPage() {
  const authed = await isAdmin();
  return authed ? <AdminDashboard /> : <AdminLogin />;
}

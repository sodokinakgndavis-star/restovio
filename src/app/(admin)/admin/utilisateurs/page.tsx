import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { UserRoleSelect } from "@/components/features/admin/user-role-select";
import { auth } from "@/lib/auth";
import { getUsersForAdmin } from "@/lib/data/users";

export const metadata = { title: "Gestion des utilisateurs" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const session = await auth();
  const { search } = await searchParams;
  const users = await getUsersForAdmin(search);

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold">Utilisateurs</h1>
      <p className="text-sm text-muted-foreground">{users.length} utilisateur(s)</p>

      <form className="mt-6 max-w-sm">
        <Input name="search" placeholder="Rechercher par nom ou e-mail…" defaultValue={search} />
      </form>

      <div className="mt-6 overflow-hidden rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Réservations</TableHead>
              <TableHead>Inscrit le</TableHead>
              <TableHead>Rôle</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user._count.bookings}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                <TableCell>
                  <UserRoleSelect
                    userId={user.id}
                    role={user.role}
                    isCurrentUser={user.id === session?.user.id}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

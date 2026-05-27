import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/SEOHead";
import { ArrowLeft, Plus, Trash2, Users, KeyRound, Shield } from "lucide-react";

type Role = "admin" | "moderator" | "user";

type AdminUser = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  created_at: string;
  last_sign_in_at: string | null;
  roles: Role[];
};

const roleLabels: Record<Role, string> = {
  admin: "Administrador",
  moderator: "Moderador",
  user: "Usuário",
};

const roleVariants: Record<Role, "default" | "secondary" | "outline"> = {
  admin: "default",
  moderator: "secondary",
  user: "outline",
};

const AdminUsers = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);

  // create form
  const [form, setForm] = useState({
    email: "", password: "", full_name: "", phone: "", role: "user" as Role,
  });
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) init();
  }, [user]);

  const init = async () => {
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user!.id, _role: "admin" });
    if (!isAdmin) {
      toast({ title: "Acesso negado", variant: "destructive" });
      navigate("/dashboard");
      return;
    }
    await load();
  };

  const call = async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("admin-users", { body });
    if (error) throw new Error(error.message);
    if (data?.error) throw new Error(data.error);
    return data;
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await call({ action: "list" });
      setUsers(data.users || []);
    } catch (e) {
      toast({ title: "Erro ao carregar usuários", description: (e as Error).message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!form.email || form.password.length < 8) {
      toast({ title: "Preencha email e senha (mín. 8 caracteres)", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await call({ action: "create", ...form });
      toast({ title: "Usuário criado com sucesso" });
      setCreateOpen(false);
      setForm({ email: "", password: "", full_name: "", phone: "", role: "user" });
      await load();
    } catch (e) {
      toast({ title: "Erro ao criar usuário", description: (e as Error).message, variant: "destructive" });
    }
    setSaving(false);
  };

  const handleRoleChange = async (u: AdminUser, role: Role) => {
    try {
      await call({ action: "set_role", user_id: u.id, role });
      toast({ title: "Permissão atualizada" });
      await load();
    } catch (e) {
      toast({ title: "Erro ao atualizar permissão", description: (e as Error).message, variant: "destructive" });
    }
  };

  const handleDelete = async (u: AdminUser) => {
    if (!confirm(`Excluir o usuário ${u.email}? Esta ação não pode ser desfeita.`)) return;
    try {
      await call({ action: "delete", user_id: u.id });
      toast({ title: "Usuário excluído" });
      await load();
    } catch (e) {
      toast({ title: "Erro ao excluir", description: (e as Error).message, variant: "destructive" });
    }
  };

  const handleResetPassword = async () => {
    if (!resetOpen || newPassword.length < 8) {
      toast({ title: "Senha deve ter no mínimo 8 caracteres", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await call({ action: "reset_password", user_id: resetOpen.id, password: newPassword });
      toast({ title: "Senha redefinida" });
      setResetOpen(null);
      setNewPassword("");
    } catch (e) {
      toast({ title: "Erro ao redefinir senha", description: (e as Error).message, variant: "destructive" });
    }
    setSaving(false);
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Gerenciar Usuários" description="Cadastro e permissões de usuários" noindex />
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground shrink-0">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-base sm:text-xl font-bold flex items-center gap-2 truncate">
              <Users size={20} /> Usuários e Permissões
            </h1>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus size={16} /> Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Usuário</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome completo</Label>
                  <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Senha * (mín. 8 caracteres)</Label>
                  <Input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Permissão</Label>
                  <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Role })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuário</SelectItem>
                      <SelectItem value="moderator">Moderador</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
                <Button onClick={handleCreate} disabled={saving}>{saving ? "Criando..." : "Criar usuário"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Carregando...</div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Permissão</TableHead>
                  <TableHead>Último acesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const currentRole = (u.roles[0] || "user") as Role;
                  const isSelf = u.id === user?.id;
                  return (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="font-medium">{u.full_name || "—"}</div>
                        <div className="text-sm text-muted-foreground">{u.email}</div>
                      </TableCell>
                      <TableCell>
                        {isSelf ? (
                          <Badge variant={roleVariants[currentRole]} className="gap-1">
                            <Shield size={12} /> {roleLabels[currentRole]}
                          </Badge>
                        ) : (
                          <Select value={currentRole} onValueChange={(v) => handleRoleChange(u, v as Role)}>
                            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">Usuário</SelectItem>
                              <SelectItem value="moderator">Moderador</SelectItem>
                              <SelectItem value="admin">Administrador</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString("pt-BR") : "Nunca"}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => { setResetOpen(u); setNewPassword(""); }} className="gap-1">
                          <KeyRound size={14} /> Senha
                        </Button>
                        {!isSelf && (
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(u)} className="gap-1">
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {users.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">Nenhum usuário</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      <Dialog open={!!resetOpen} onOpenChange={(o) => !o && setResetOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redefinir senha — {resetOpen?.email}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Nova senha (mín. 8 caracteres)</Label>
            <Input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetOpen(null)}>Cancelar</Button>
            <Button onClick={handleResetPassword} disabled={saving}>{saving ? "Salvando..." : "Salvar nova senha"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const VALID_ROLES = ["admin", "moderator", "user"] as const;
type Role = (typeof VALID_ROLES)[number];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Não autorizado" }, 401);

    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const userClient = createClient(url, anon, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userErr } = await userClient.auth.getUser(token);
    if (userErr || !userData?.user) return json({ error: "Não autorizado" }, 401);

    const { data: isAdmin } = await userClient.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) return json({ error: "Apenas administradores" }, 403);

    const admin = createClient(url, service);
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const action = body.action as string;

    if (action === "list") {
      const { data: list, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
      if (error) return json({ error: error.message }, 400);
      const ids = list.users.map((u) => u.id);
      const { data: roles } = await admin.from("user_roles").select("user_id, role").in("user_id", ids);
      const { data: profiles } = await admin.from("profiles").select("user_id, full_name, phone").in("user_id", ids);
      const users = list.users.map((u) => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        roles: (roles || []).filter((r) => r.user_id === u.id).map((r) => r.role),
        full_name: profiles?.find((p) => p.user_id === u.id)?.full_name || "",
        phone: profiles?.find((p) => p.user_id === u.id)?.phone || "",
      }));
      return json({ users });
    }

    if (action === "create") {
      const rawEmail = (body.email as string) || "";
      const rawPassword = (body.password as string) || "";
      const email = rawEmail.trim().toLowerCase();
      const password = rawPassword.trim();
      const { full_name, phone, role } = body as {
        full_name?: string; phone?: string; role: Role;
      };
      if (!email || !password || !VALID_ROLES.includes(role)) {
        return json({ error: "Dados inválidos" }, 400);
      }
      if (password.length < 8) return json({ error: "A senha deve ter ao menos 8 caracteres" }, 400);

      const { data: created, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: full_name || "" },
      });
      if (error || !created.user) return json({ error: error?.message || "Erro ao criar usuário" }, 400);

      if (phone) {
        await admin.from("profiles").update({ phone }).eq("user_id", created.user.id);
      }
      const { error: roleErr } = await admin.from("user_roles").insert({ user_id: created.user.id, role });
      if (roleErr) return json({ error: roleErr.message }, 400);
      return json({ ok: true, user_id: created.user.id });
    }

    if (action === "set_role") {
      const { user_id, role } = body as { user_id: string; role: Role };
      if (!user_id || !VALID_ROLES.includes(role)) return json({ error: "Dados inválidos" }, 400);
      await admin.from("user_roles").delete().eq("user_id", user_id);
      const { error } = await admin.from("user_roles").insert({ user_id, role });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === "reset_password") {
      const { user_id } = body as { user_id: string };
      const password = ((body.password as string) || "").trim();
      if (!user_id || !password || password.length < 8) return json({ error: "Dados inválidos" }, 400);
      const { error } = await admin.auth.admin.updateUserById(user_id, { password, email_confirm: true });
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    if (action === "delete") {
      const { user_id } = body as { user_id: string };
      if (!user_id) return json({ error: "user_id obrigatório" }, 400);
      if (user_id === userData.user.id) return json({ error: "Você não pode excluir a si mesmo" }, 400);

      // Preserva os imóveis cadastrados: reatribui ao admin que está excluindo
      const { error: reassignErr } = await admin
        .from("properties")
        .update({ user_id: userData.user.id })
        .eq("user_id", user_id);
      if (reassignErr) return json({ error: `Falha ao preservar imóveis: ${reassignErr.message}` }, 400);

      // Remove vínculos que bloqueariam a exclusão do usuário
      await admin.from("user_roles").delete().eq("user_id", user_id);
      await admin.from("profiles").delete().eq("user_id", user_id);

      const { error } = await admin.auth.admin.deleteUser(user_id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: "Ação desconhecida" }, 400);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    return json({ error: msg }, 500);
  }
});

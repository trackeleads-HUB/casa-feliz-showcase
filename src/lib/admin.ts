import type { User } from "@supabase/supabase-js";

export const MASTER_ADMIN_EMAIL = "cleber.ceo@gmail.com";

export const isMasterAdmin = (user: User | null | undefined): boolean => {
  return user?.email?.toLowerCase() === MASTER_ADMIN_EMAIL;
};

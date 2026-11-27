"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type PermissionsContextType = {
  permissions: string[];
  roles: string[];
  loading: boolean;
  refresh: () => Promise<void>;
  updateLocal: (newPermissions: string[], newRoles: string[]) => void;
};

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [permissions, setPermissions] = useState<string[]>(
    () => session?.user?.permissions ?? []
  );
  const [roles, setRoles] = useState<string[]>(() => session?.user?.roles ?? []);
  const [loading, setLoading] = useState(
    () => status === "loading" || (status === "authenticated" && !session?.user?.permissions)
  );

  const fetchPermissions = useCallback(async () => {
    try {
      const res = await fetch("/api/backend/me/permissions", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Gagal memuat permissions");

      const data = await res.json();
      const newPermissions = data.user.permissions || [];
      const newRoles = data.user.roles || [];

      setPermissions(newPermissions);
      setRoles(newRoles);

      sessionStorage.setItem(
        "userPermissions",
        JSON.stringify({ permissions: newPermissions, roles: newRoles })
      );
    } catch (err) {
      console.error("fetchPermissions error:", err);
      setPermissions([]);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Bersihkan sessionStorage saat logout
  useEffect(() => {
    if (status === "unauthenticated") {
      sessionStorage.removeItem("userPermissions");
      setPermissions([]);
      setRoles([]);
      setLoading(false);
    }
  }, [status]);

  // Gunakan cache sessionStorage / JWT session saat mount, lalu sinkronisasi sekali saat authenticated
  useEffect(() => {
    const cached = sessionStorage.getItem("userPermissions");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setPermissions(parsed.permissions || []);
        setRoles(parsed.roles || []);
        setLoading(false);
      } catch {
        console.warn("Failed to parse userPermissions from sessionStorage");
      }
    } else if (session?.user?.permissions) {
      setPermissions(session.user.permissions);
      setRoles(session.user.roles ?? []);
      setLoading(false);
    }

    if (status === "authenticated") {
      fetchPermissions();
    }
  }, [status, session, fetchPermissions]);

  // Update lokal tanpa fetch, untuk UI langsung responsive
  function updateLocal(newPermissions: string[], newRoles: string[]) {
    setPermissions(newPermissions);
    setRoles(newRoles);
    sessionStorage.setItem(
      "userPermissions",
      JSON.stringify({ permissions: newPermissions, roles: newRoles })
    );
  }

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        roles,
        loading,
        refresh: fetchPermissions,
        updateLocal,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

// Hook untuk pakai permissions di komponen
export function usePermissions() {
  const ctx = useContext(PermissionsContext);
  if (!ctx) throw new Error("usePermissions must be used within PermissionsProvider");
  return ctx;
}

import { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "wouter";
import { useSeo } from "@/lib/seo";
import { getAdminToken } from "./auth";
import { AdminLogin } from "./AdminLogin";
import { AdminLayout } from "./AdminLayout";
import { AdminModelsList } from "./AdminModelsList";
import { AdminModelEdit } from "./AdminModelEdit";
import { AdminLeads } from "./AdminLeads";
import { AdminAvailability } from "./AdminAvailability";
import { AdminPostsList } from "./AdminPostsList";
import { AdminPostEdit } from "./AdminPostEdit";

export function AdminApp() {
  useSeo({
    title: "Admin",
    description: "Midcentury ADU admin console.",
    noindex: true,
  });
  const [token, setToken] = useState<string | null>(() => getAdminToken());

  useEffect(() => {
    function sync() {
      setToken(getAdminToken());
    }
    window.addEventListener("hemma_admin_token_changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("hemma_admin_token_changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (!token) return <AdminLogin />;

  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={AdminModelsList} />
        <Route path="/admin/leads" component={AdminLeads} />
        <Route path="/admin/availability" component={AdminAvailability} />
        <Route path="/admin/models/:id">
          {(params) => <AdminModelEdit id={Number(params.id)} />}
        </Route>
        <Route path="/admin/posts" component={AdminPostsList} />
        <Route path="/admin/posts/:id">
          {(params) => <AdminPostEdit id={Number(params.id)} />}
        </Route>
        <Route><Redirect to="/admin" /></Route>
      </Switch>
    </AdminLayout>
  );
}

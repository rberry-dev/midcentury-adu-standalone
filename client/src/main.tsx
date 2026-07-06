import { createRoot } from "react-dom/client";
import { setAuthTokenGetter } from "@/lib/api";
import App from "./App";
import { getAdminToken } from "./admin/auth";
import "./index.css";

setAuthTokenGetter(() => getAdminToken());

createRoot(document.getElementById("root")!).render(<App />);

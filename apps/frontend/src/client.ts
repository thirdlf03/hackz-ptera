import { hc } from "hono/client";
import type { AppType } from "@repo/api";

const API_URL = import.meta.env.PROD ? "/" : "/api";

export const client = hc<AppType>(API_URL);

import { hc } from "hono/client";
import type { AppType } from "@repo/api";

const API_URL = "/api";

export const client = hc<AppType>(API_URL);

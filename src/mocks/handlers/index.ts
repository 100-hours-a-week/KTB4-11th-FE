import type { HttpHandler } from "msw";
import { accountHandlers } from "@/mocks/handlers/account";
import { authHandlers } from "@/mocks/handlers/auth";
import { holdingsHandlers } from "@/mocks/handlers/holdings";

export const handlers: HttpHandler[] = [
  ...authHandlers,
  ...accountHandlers,
  ...holdingsHandlers,
];

import type { Context } from "hono";
export default (c: Context) => c.json({ disabled: true, message: "Control Deck is stopped" }, 503);

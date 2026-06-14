import { mkdirSync, cpSync, rmSync, existsSync } from "fs";
const out = ".vercel/output";
mkdirSync(out + "/functions/__server.func", { recursive: true });
cpSync("dist/config.json", out + "/config.json");
rmSync(out + "/static", { recursive: true, force: true });
cpSync("dist/client", out + "/static", { recursive: true });
rmSync(out + "/functions/__server.func", { recursive: true, force: true });
cpSync("dist/server", out + "/functions/__server.func", { recursive: true });
["client","server","nitro.json"].forEach(f => rmSync(out + "/" + f, { recursive: true, force: true }));

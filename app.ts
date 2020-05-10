import { Application, MiddlewareFunc } from "https://deno.land/x/abc/mod.ts";
import { HttpMethod } from "https://deno.land/x/abc/constants.ts";
import { cors } from "https://deno.land/x/abc/middleware/cors.ts";
import mp3ToZip from "./convert.ts";

const app = new Application();
app.use(cors());

app.post("/convert", mp3ToZip).start({ port: 8080 });
console.log("server running");

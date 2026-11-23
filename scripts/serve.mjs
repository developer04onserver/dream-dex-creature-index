import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
const root=resolve(process.argv[2]||".");
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",".css":"text/css; charset=utf-8",".svg":"image/svg+xml",".json":"application/json"};
const server=createServer(async(req,res)=>{try{const path=decodeURIComponent(new URL(req.url||"/","http://localhost").pathname);const rel=path==="/ "||path==="/"?"index.html":path.slice(1);const file=resolve(root,rel);if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);res.end("Forbidden");return;}if(!(await stat(file)).isFile()){res.writeHead(404);res.end("Not found");return;}res.writeHead(200,{"content-type":mime[extname(file)]||"application/octet-stream","x-content-type-options":"nosniff"});res.end(await readFile(file));}catch{res.writeHead(404);res.end("Not found");}});
const port=Number(process.env.PORT||4173);server.listen(port,"0.0.0.0",()=>console.log("Dream Dex: http://localhost:"+port));

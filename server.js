import express, { json } from "express";
import { createServer } from "http";

const PORT = 80;
const app = express();
const server = createServer(app);

app.set("port", PORT);
app.use(json());

app.use(express.static("static"));

server.listen(app.get("port"), () => {
  console.info(`${new Date()} Website server listening on ${PORT}.`);
});

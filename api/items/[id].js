import { MongoClient, ObjectId } from "mongodb";

async function getCollection() {
  const client = new MongoClient(process.env.Armazenamento_MONGODB_URI);
  await client.connect();
  return client.db("Lembrete").collection("items");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { id } = req.query;
  let oid;

  try { oid = new ObjectId(id); }
  catch { return res.status(400).json({ error: "ID inválido" }); }

  const col = await getCollection();

  if (req.method === "PATCH") {
    const { done } = req.body;
    await col.updateOne({ _id: oid }, { $set: { done } });
    return res.json({ ok: true });
  }

  if (req.method === "DELETE") {
    await col.deleteOne({ _id: oid });
    return res.json({ ok: true });
  }

  res.status(405).json({ error: "Método não permitido" });
}
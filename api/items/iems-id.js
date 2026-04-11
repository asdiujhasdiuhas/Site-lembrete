import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

async function getCollection() {
  await client.connect();
  return client.db("efgnl").collection("items");
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

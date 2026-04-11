import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

async function getCollection() {
  await client.connect();
  return client.db("efgnl").collection("items");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const col = await getCollection();

  if (req.method === "GET") {
    const items = await col.find({}).sort({ date: 1 }).toArray();
    return res.json(items);
  }

  if (req.method === "POST") {
    const { desc, date, tipo } = req.body;
    if (!desc) return res.status(400).json({ error: "desc obrigatório" });
    const item = { desc, date: date || null, tipo: tipo || "outro", done: false, createdAt: new Date() };
    const result = await col.insertOne(item);
    return res.status(201).json({ ...item, _id: result.insertedId });
  }

  res.status(405).json({ error: "Método não permitido" });
}

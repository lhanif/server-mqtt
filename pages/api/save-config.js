import { setConfig } from "../../config";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { brokerUrl, brokerPort, topic } = req.body;
  if (!brokerUrl || !brokerPort || !topic) {
    return res.status(400).json({ error: "brokerUrl, brokerPort, and topic are required" });
  }

  setConfig({ brokerUrl, brokerPort, topic });
  res.status(200).json({ status: "saved", brokerUrl, brokerPort, topic });
}

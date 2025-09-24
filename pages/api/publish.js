import mqtt from "mqtt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { topic, message } = req.body;

  if (!topic || !message) {
    return res.status(400).json({ error: "topic dan message wajib diisi" });
  }

  // Broker public contoh (ganti jika punya broker sendiri)
  const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

  client.on("connect", () => {
    client.publish(topic, message, () => {
      client.end();
      res.status(200).json({ success: true, topic, message });
    });
  });

  client.on("error", (err) => {
    res.status(500).json({ error: err.message });
  });
}

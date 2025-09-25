import mqtt from "mqtt";

export default async function handler(req, res) {
  // Hanya izinkan POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { topic, message } = req.body;
  if (!topic || !message) {
    return res.status(400).json({ error: "topic and message are required" });
  }

  try {
    // URL broker sudah fix WSS HiveMQ
    const BROKER_URL = "wss://broker.hivemq.com:8884/mqtt";

    const client = mqtt.connect(BROKER_URL);

    client.on("connect", () => {
      console.log(`✅ Connected to MQTT Broker: ${BROKER_URL}`);
      client.publish(topic, message, {}, (err) => {
        if (err) {
          console.error("Publish Error:", err);
          res.status(500).json({ error: "Failed to publish message" });
        } else {
          console.log(`📤 Published to ${topic}: ${message}`);
          res.status(200).json({
            status: "published",
            broker: BROKER_URL,
            topic,
            message,
          });
        }
        client.end();
      });
    });

    client.on("error", (err) => {
      console.error("MQTT Connection Error:", err);
      // Balas error ke client hanya jika belum terkirim
      if (!res.headersSent) {
        res.status(500).json({ error: "MQTT connection failed" });
      }
    });
  } catch (err) {
    console.error("Handler Error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

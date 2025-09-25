import mqtt from "mqtt";
import { getConfig } from "../../config";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  try {
    // Ambil konfigurasi dinamis
    const { brokerUrl, brokerPort, topic, protocol } = getConfig();
    // Pastikan protocol default ke wss agar jalan di Vercel
    const scheme = protocol || "wss";

    // Bentuk URL penuh, contoh:
    // wss://broker.hivemq.com:8884/mqtt
    const fullUrl = `${scheme}://${brokerUrl}:${brokerPort}/mqtt`;

    const client = mqtt.connect(fullUrl);

    client.on("connect", () => {
      console.log(`Connected to MQTT Broker: ${fullUrl}`);
      client.publish(topic, message, () => {
        console.log(`Published to ${topic}: ${message}`);
        client.end();
      });
    });

    client.on("error", (err) => {
      console.error("MQTT Connection Error:", err);
    });

    res.status(200).json({
      status: "published",
      topic,
      message,
      broker: fullUrl
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to publish" });
  }
}

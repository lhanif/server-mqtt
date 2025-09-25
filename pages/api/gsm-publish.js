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
    const { brokerUrl, brokerPort, topic } = getConfig();
    const client = mqtt.connect(`${brokerUrl}:${brokerPort}`);

    client.on("connect", () => {
      client.publish(topic, message, () => {
        client.end();
      });
    });

    res.status(200).json({
      status: "published",
      topic,
      message,
      broker: `${brokerUrl}:${brokerPort}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to publish" });
  }
}


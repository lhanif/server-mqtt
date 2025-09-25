import mqtt from "mqtt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { broker, port, topic, message } = req.body;

  if (!broker || !port || !topic || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // format wss://broker.hivemq.com:8884/mqtt
    const mqttUrl = `wss://${broker}:${port}/mqtt`;
    const client = mqtt.connect(mqttUrl);

    client.on("connect", () => {
      client.publish(topic, message, { qos: 0 }, (err) => {
        client.end();
        if (err) {
          return res.status(500).json({ error: "Publish failed" });
        }
        return res.status(200).json({
          status: "published",
          broker,
          port,
          topic,
          message
        });
      });
    });

    client.on("error", (err) => {
      console.error("MQTT Error:", err);
      return res.status(500).json({ error: "MQTT connection failed" });
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}

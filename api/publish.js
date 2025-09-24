import mqtt from 'mqtt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { topic, message } = req.body;
  if (!topic || !message) {
    return res.status(400).json({ error: 'topic and message required' });
  }

  try {
    const client = mqtt.connect('mqtt://broker.hivemq.com');
    client.on('connect', () => {
      client.publish(topic, message, () => {
        client.end();
      });
    });
    res.status(200).json({ status: 'published', topic, message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Publish failed' });
  }
}

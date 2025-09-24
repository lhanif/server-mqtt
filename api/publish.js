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
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', {
      clientId: 'vercel-' + Math.random().toString(16).substr(2, 8),
      clean: true,
      reconnectPeriod: 0
    });

    client.on('connect', () => {
      console.log('Connected to HiveMQ');
      client.publish(topic, message, { qos: 0 }, (err) => {
        if (err) console.error('Publish error:', err);
        client.end();
      });
    });

    client.on('error', (err) => console.error('MQTT error:', err));

    // Kirim respon HTTP lebih dulu supaya GSM tidak timeout
    res.status(200).json({ status: 'published', topic, message });
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ error: 'Publish failed' });
  }
}

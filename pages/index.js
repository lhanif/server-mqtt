import { useState } from "react";

export default function Home() {
  const [brokerUrl, setBrokerUrl] = useState("mqtt://broker.hivemq.com");
  const [brokerPort, setBrokerPort] = useState("1883");
  const [topic, setTopic] = useState("gsm/data");
  const [status, setStatus] = useState("");

  const saveConfig = async () => {
    setStatus("Saving...");
    try {
      const res = await fetch("/api/save-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brokerUrl, brokerPort, topic })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus(`✅ Saved! Broker: ${data.brokerUrl}:${data.brokerPort} Topic: ${data.topic}`);
      } else {
        setStatus(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      setStatus("❌ Failed to save");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>MQTT Bridge Config</h1>

      <label>Broker URL:</label>
      <input
        style={{ width: "100%", marginBottom: "1rem" }}
        value={brokerUrl}
        onChange={(e) => setBrokerUrl(e.target.value)}
      />

      <label>Broker Port:</label>
      <input
        style={{ width: "100%", marginBottom: "1rem" }}
        value={brokerPort}
        onChange={(e) => setBrokerPort(e.target.value)}
      />

      <label>Topic:</label>
      <input
        style={{ width: "100%", marginBottom: "1rem" }}
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <button
        style={{ padding: "0.5rem 1rem", background: "#0070f3", color: "white", border: "none" }}
        onClick={saveConfig}
      >
        Save
      </button>

      <p style={{ marginTop: "1rem" }}>{status}</p>
    </div>
  );
}

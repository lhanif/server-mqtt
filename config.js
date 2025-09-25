let config = {
  brokerUrl: "broker.hivemq.com",
  brokerPort: "8884",
  protocol: "wss", // default wss untuk Vercel
  topic: "nipi/stm32/bisa"
};

export function getConfig() {
  return config;
}

export function setConfig(newConfig) {
  config = { ...config, ...newConfig };
}

// config.js
let mqttConfig = {
  brokerUrl: "mqtt://broker.hivemq.com",
  brokerPort: "1883",
  topic: "gsm/data",
};

export function getConfig() {
  return mqttConfig;
}

export function setConfig(newConfig) {
  mqttConfig = { ...mqttConfig, ...newConfig };
}

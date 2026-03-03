import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const verifyCard = async (cardId, stationCode, agentKey, workspaceId) => {
  const payload = {
    station_code: stationCode,
    agent_key: agentKey,
    card_identifier: cardId,
    workspace_id: workspaceId,
  };

  const res = await axios.post(`${API_URL}/stations/verify`, payload);
  return res.data;
};

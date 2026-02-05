import axios from "axios";

const UNBOUND_API_URL = "https://api.getunbound.ai/v1/chat/completions";

export async function callUnbound(model, prompt) {
  const response = await axios.post(
    UNBOUND_API_URL,
    {
      model,
      messages: [
        { role: "user", content: prompt }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.UNBOUND_API_KEY}`,
        "Content-Type": "application/json"
      },
      timeout: 60000
    }
  );

  return response.data;
}

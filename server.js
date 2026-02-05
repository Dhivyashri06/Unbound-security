import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { callUnbound } from "./unboundClient.js";
import { runWorkflow } from "./workflowExec.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Test route to check Unbound connectivity
app.get("/test-unbound", async (req, res) => {
  try {
    const result = await callUnbound(
      "kimi-k2p5",
      "Hello from backend test"
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Workflow execution route
app.post("/run-workflow", async (req, res) => {
  try {
    // Accepts either { workflow: [...] } or { workflow: { steps: [...] } }
    const result = await runWorkflow(req.body.workflow);
    res.json({ success: true, result });
  } catch (err) {
    res.status(400).json(err);
  }
});

app.listen(process.env.PORT, () =>
  console.log("Backend running on port", process.env.PORT)
);

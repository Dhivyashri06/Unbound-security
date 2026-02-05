const steps = document.querySelectorAll(".step");
const output = document.getElementById("output");

// Render each step block
steps.forEach((step, index) => {
  step.innerHTML = `
    <h3>Step ${index + 1}</h3>

    <label>Model</label>
    <select class="model">
      <option value="kimi-k2p5">kimi-k2p5</option>
      <option value="kimi-k2-instruct-0905">kimi-k2-instruct-0905</option>
    </select>

    <label>Prompt (use {{context}} to chain)</label>
    <textarea class="prompt"></textarea>

    <label>Completion keywords (comma separated)</label>
    <input class="criteria" placeholder="summary, risk" />

    <label>Max retries</label>
    <input class="retries" type="number" value="1" min="0" />
  `;
});

// Attach click handler
document.getElementById("run").addEventListener("click", async () => {
  output.textContent = "Running workflow...";

  // Build workflow array from UI
  const workflow = Array.from(document.querySelectorAll(".step")).map((step, index) => {
    const keywords = step.querySelector(".criteria").value
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    return {
      name: `Step ${index + 1}`,
      model: step.querySelector(".model").value,
      prompt: step.querySelector(".prompt").value,
      criteria: keywords.length ? { mustInclude: keywords } : null,
      retries: Number(step.querySelector(".retries").value)
    };
  });

  try {
    const res = await fetch("http://localhost:3001/run-workflow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workflow })
    });

    const data = await res.json();
    console.log("Backend response:", data); // Debug in console

    if (data.result && data.result.length > 0) {
  output.textContent = data.result
    .map(step => `${step.step}\nOutput: ${step.output}`)
    .join("\n\n");
} else {
  output.textContent = JSON.stringify(data, null, 2);
}


  } catch (err) {
    output.textContent = "Failed to reach backend";
  }
});

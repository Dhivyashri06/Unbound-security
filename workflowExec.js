import { callUnbound } from "./unboundClient.js";

function checkCriteria(output, criteria) {
  if (!criteria) return true;

  if (criteria.mustInclude) {
    return criteria.mustInclude.every(word =>
      output.toLowerCase().includes(word.toLowerCase())
    );
  }

  if (criteria.validJSON) {
    try {
      JSON.parse(output);
      return true;
    } catch {
      return false;
    }
  }

  return true;
}

export async function runWorkflow(workflow) {
  const steps = workflow.steps || workflow;
  let context = "";
  const executionLog = [];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    let success = false;
    let output = "";

    for (let attempt = 1; attempt <= step.retries; attempt++) {
      const prompt = step.prompt.replace("{{context}}", context);

      // Get full response from Unbound
      const response = await callUnbound(step.model, prompt);

      // Extract just the assistant’s text
      if (response && response.choices && response.choices.length > 0) {
        output = response.choices[0].message.content;
      } else {
        output = JSON.stringify(response); // fallback for debugging
      }

      // Check criteria
      if (checkCriteria(output, step.criteria)) {
        success = true;
        break; // stop retrying once successful
      }
    }

    executionLog.push({
      step: step.name,
      output,
      success
    }
  )
  
    context = output;

    if (!success) {
      throw { error: "Step failed", executionLog };
    }

    // Pass output forward as context for next step
    context = output;
  }
  
  console.log("Execution log:", executionLog);
  return executionLog;
}

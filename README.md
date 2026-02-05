# Workflow Chaining App

Each step can have its own prompt, model, and rules, and the output from one step flows into the next using `{{context}}`.
The idea is to make it easy to chain prompts together and see how the model handles them.

---

## What it does
- Lets you define a series of steps (prompt + model + retries).
- Passes the output of one step into the next automatically.
- Shows all the results in the frontend so you can follow the chain.
- Handles errors and timeouts so the workflow doesn’t just hang.

---

## How it’s set up
- **Backend**: Node.js with Express.  
  - `unboundClient.js` → makes API calls to Unbound.  
  - `workflowExec.js` → runs the steps, checks criteria, and builds the log.  
  - `server.js` → exposes `/run-workflow`.

- **Frontend**: Plain HTML/JS.  
  - `app.js` → collects steps, sends them to the backend, and displays results.

- **Environment**: API key is stored in `.env` (don’t commit this file).  
  You can add a `.env.example` with placeholders if you want to share setup instructions.

---

## Running it
1. Install dependencies through:
   ```bash
   npm install

2. Add API key to the .env file
UNBOUND_API_KEY=your_api_key_here

3. Start the backend
node server.js

4. Open index.html in a browser and enter prompts to look for outputs

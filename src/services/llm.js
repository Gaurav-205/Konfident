const BASE_URL = 'https://api.experientiallabs.ai/v1';
const MODEL = 'gpt-6-astra';

function getApiKey() {
  const key = process.env.EXPLABS_API_KEY;
  if (!key) {
    throw new Error('EXPLABS_API_KEY environment variable is not set. Please create one under Settings -> API keys and export it.');
  }
  return key;
}

/**
 * Creates a chat completion routed through the Experiential gateway.
 * Speaks the OpenAI Chat Completions API, preserving tools, tool_choice, and streaming.
 */
async function createChatCompletion(options = {}) {
  const apiKey = getApiKey();
  const payload = {
    model: MODEL,
    ...options
  };

  const response = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Experiential gateway error (${response.status}): ${errText}`);
  }

  if (options.stream) {
    return response.body;
  }

  return response.json();
}

module.exports = {
  BASE_URL,
  MODEL,
  createChatCompletion
};

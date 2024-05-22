import console from 'console';
import express from 'express';
import process from 'process';
import { CONSTANTS } from './constants.mjs';
import { fetchAccessToken } from './utils.mjs';

const app = express();

app.disable('x-powered-by');

app.use(express.json());

app.post("/v1/chat/completions", async (req, res) => {
  if (req.body.stream) {
    return res.status(400).json({
      "error": "streaming is not supported"
    });
  }
  const model = req.body.model ?? 'ernie-speed-128k';
  // Default model is ERNIE-Bot-turbo
  // get token
  const accessToken = await fetchAccessToken();
  const response = await fetch(`${CONSTANTS.WEN_XIN_BASE_URL}/chat/${model}?access_token=${accessToken}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body)
  });

  res.set('Content-Type', response.headers.get('Content-Type'));

  if (response.headers.get('Content-Type').includes('application/json')) {
    const data = await response.json();
    res.json({
      "id": data.id,
      "object": "chat.completion",
      "created": data.created,
      "model": model,
      "system_fingerprint": `dummy-${data.id}`,
      "choices": [{
        "index": 0,
        "message": {
          "role": "assistant",
          "content": data.result,
        },
        "logprobs": null,
        "finish_reason": "stop"
      }],
      "usage": data.usage
    });
    return;
  }

});

app.get("/v1/models", async (req, res) => {
  res.json({
    "object": "list",
    "data": [
      {
        "id": "ernie-speed-128k",
        "object": "model",
        "created": 1686935002,
        "owned_by": "organization-owner"
      },
      {
        "id": "ernie-speed-8k",
        "object": "model",
        "created": 1686935002,
        "owned_by": "organization-owner",
      },
    ],
  });
});


app.listen(parseInt(process.env.PORT ?? 3000), () => {
  console.log(`Server is running on port`, process.env.PORT ?? 3000);
});
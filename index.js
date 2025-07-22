import express from 'express';
import crypto from 'crypto-js';

const app = express();
app.use(express.json());

app.post('/generate-headers', (req, res) => {
  const { scope_id, chat_id, channel_secret } = req.body;

  const method = 'GET';
  const contentType = 'application/json';
  const contentMD5 = crypto.MD5('').toString();
  const date = new Date().toUTCString();
  const path = `/v2/origin/custom/${scope_id}/chats/${chat_id}/history`;

  const signString = `${method}\n${contentMD5}\n${contentType}\n${date}\n${path}`;
  const signature = crypto.HmacSHA1(signString, channel_secret).toString();

  res.json({
    'Content-MD5': contentMD5,
    'Date': date,
    'Content-Type': contentType,
    'X-Signature': signature
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Signature service running on port ${port}`));

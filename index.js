const functions = require("firebase-functions");
const admin = require("firebase-admin");
const OpenAI = require("openai");

admin.initializeApp();

const openai = new OpenAI({
  apiKey: functions.config().openai.key,
});

exports.chatAI = functions.https.onCall(async (data, context) => {
  const userMessage = data.message;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful AI assistant." },
      { role: "user", content: userMessage }
    ],
  });

  return {
    reply: response.choices[0].message.content
  };
});

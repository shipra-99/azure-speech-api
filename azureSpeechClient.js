const axios = require('axios');

const speechKey = process.env.SPEECH_KEY;
const region = process.env.SPEECH_REGION;

if (!speechKey || !region) {
  throw new Error('SPEECH_KEY and SPEECH_REGION must be set');
}

// Speech-to-text (short audio)
async function transcribeShortAudio(buffer, language = 'en-US') {
  const url = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${encodeURIComponent(language)}`;

  const response = await axios.post(url, buffer, {
    headers: {
      'Ocp-Apim-Subscription-Key': speechKey,
      'Content-Type': 'audio/wav', // adjust to your format
      'Accept': 'application/json'
    },
    maxBodyLength: Infinity
  });

  return response.data;
}

// Text-to-speech
async function synthesizeSpeech({ text, voice, format }) {
  const url = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

  const ssml = `
    <speak version="1.0" xml:lang="en-US">
      <voice name="${voice}">
        ${text}
      </voice>
    </speak>
  `.trim();

  const response = await axios.post(url, ssml, {
    headers: {
      'Ocp-Apim-Subscription-Key': speechKey,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': format || 'audio-16khz-32kbitrate-mono-mp3'
    },
    responseType: 'arraybuffer'
  });

  return response;
}

module.exports = {
  transcribeShortAudio,
  synthesizeSpeech
};

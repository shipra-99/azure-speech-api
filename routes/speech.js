const express = require('express');
const multer = require('multer');
const Joi = require('joi');
const { transcribeShortAudio, synthesizeSpeech } = require('../azureSpeechClient');

const router = express.Router();
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('audio/')) {
      return cb(new Error('Only audio files are allowed'));
    }
    cb(null, true);
  }
});

// POST /api/v1/speech/transcribe
router.post('/transcribe', upload.single('audio'), async (req, res, next) => {
  try {
    if (!req.file) {
      const err = new Error('audio file is required');
      err.code = 'MISSING_AUDIO';
      err.status = 400;
      throw err;
    }

    const language = req.query.language || 'en-US';
    const data = await transcribeShortAudio(req.file.buffer, language);

    res.json({
      transcript: data.DisplayText || data.NBest?.[0]?.Display,
      raw: data
    });
  } catch (err) {
    if (err.response) {
      console.error('Azure error:', err.response.data);
    }
    next(err);
  }
});

// POST /api/v1/speech/synthesize
router.post('/synthesize', async (req, res, next) => {
  try {
    const schema = Joi.object({
      text: Joi.string().min(1).max(5000).required(),
      voice: Joi.string().default('en-US-Ava:DragonHDLatestNeural'),
      format: Joi.string().optional()
    });

    const { value, error } = schema.validate(req.body);
    if (error) {
      const err = new Error(error.details[0].message);
      err.status = 400;
      err.code = 'INVALID_INPUT';
      throw err;
    }

    const azureRes = await synthesizeSpeech(value);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'inline; filename="speech.mp3"');
    res.send(Buffer.from(azureRes.data, 'binary'));
  } catch (err) {
    next(err);
  }
});

module.exports = router;

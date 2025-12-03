# Azure Speech Gateway API

A simple REST API that exposes **Azure Text-to-Speech** and **Speech-to-Text** behind one easy gateway.
Clients call this API; it forwards requests to **Azure AI Speech** and returns the result.

* **Tech stack:** Node.js, Express, Azure AI Speech
* **Hosting:** DigitalOcean droplet

---

## Features

* **Text-to-Speech (TTS):** Send text, get back an audio file
* **Speech-to-Text (STT):** Upload audio, get back a transcript
* Hides Azure keys, regions, and SDK complexity
* Easy to test with Postman or curl

---

## Base URL

```text
http://159.89.184.113:3000/api/v1
```

### Endpoints

* `POST /speech/synthesize` – Text-to-Speech
* `POST /speech/transcribe` – Speech-to-Text

---

## Quickstart (Postman)

### 1) Text-to-Speech

**Request**

* Method: `POST`
* URL: `http://159.89.184.113:3000/api/v1/speech/synthesize`
* Headers: `Content-Type: application/json`

**Body (raw JSON)**

```json
{
  "text": "Hello, this is your Azure speech proxy API. My name is Shipra",
  "voice": "en-US-AvaMultilingualNeural",
  "format": "audio-16khz-32kbitrate-mono-mp3"
}
```

**Response**

* Status: `200 OK`
* Body: audio file (MP3) – you can play or download it in Postman.

---

### 2) Speech-to-Text

**Request**

* Method: `POST`
* URL: `http://159.89.184.113:3000/api/v1/speech/transcribe`
* Headers: `Content-Type: multipart/form-data`

**Body (form-data)**

* Key: `file`
* Type: **File**
* Value: upload a `.wav` or `.mp3` file

**Example response**

```json
{
  "transcript": "Add in soil to plant spring corn.",
  "raw": {
    "RecognitionStatus": "Success",
    "Offset": 700000,
    "Duration": 57800000,
    "DisplayText": "Add in soil to plant spring corn"
  }
}
```

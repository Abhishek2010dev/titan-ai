import time
import os
import sounddevice as sd
from scipy.io.wavfile import write
from faster_whisper import WhisperModel
import numpy as np
import shlex

SAMPLE_RATE = 16000
CHANNELS = 1
OUTPUT_FILE = "output.wav"
WHISPER_MODEL_SIE = "small"


SILENCE_THRESHOLD = 0.01
SILENCE_DURATION = 1.0


def record_audio() -> None:
    print("Start speaking...")
    audio_data = []
    silence_start = None

    while True:
        chunk = sd.rec(
            int(0.2 * SAMPLE_RATE), samplerate=SAMPLE_RATE, channels=CHANNELS
        )
        sd.wait()
        chunk_rms = np.sqrt(np.mean(chunk**2))  # Loudness check
        audio_data.append(chunk)

        if chunk_rms < SILENCE_THRESHOLD:
            if silence_start is None:
                silence_start = time.time()
            elif time.time() - silence_start >= SILENCE_DURATION:
                break
        else:
            silence_start = None

    audio_data = np.concatenate(audio_data, axis=0)
    write(OUTPUT_FILE, SAMPLE_RATE, audio_data)
    print("Recording complete.")


whisper_model = WhisperModel(WHISPER_MODEL_SIE)


def main() -> None:
    while 1:
        record_audio()
        segments, _ = whisper_model.transcribe(OUTPUT_FILE, language="en")
        text = " ".join([segment.text for segment in segments])
        if text != "":
            print(f"Transcribed text: {text}")
            os.system(f"espeak {shlex.quote('You sayed ' + text)}")


if __name__ == "__main__":
    main()

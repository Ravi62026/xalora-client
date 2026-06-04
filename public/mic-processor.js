/**
 * mic-processor.js — AudioWorklet Processor
 *
 * Runs on the dedicated audio rendering thread (NOT the main JS thread).
 * This means zero main-thread blocking, no UI jank, and lower latency
 * compared to the deprecated ScriptProcessor.
 *
 * How it works:
 *  - AudioWorklet calls process() every 128 samples (~8ms at 16kHz)
 *  - We accumulate samples into a configurable buffer (default 2048 = 128ms)
 *  - When the buffer is full, we convert Float32 → Int16 PCM and
 *    postMessage() it to the main thread
 *  - Main thread receives it and emits to socket → Deepgram
 *
 * Buffer size trade-off:
 *   Smaller (1024) = lower latency, more socket messages
 *   Larger  (4096) = higher latency, fewer socket messages
 *   2048 @ 16kHz  = ~128ms — good balance for voice
 */

class MicProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super();
        // How many samples to accumulate before sending a chunk.
        // Passed via processorOptions when creating AudioWorkletNode.
        this._bufferSize = (options?.processorOptions?.bufferSize) || 2048;
        this._buffer     = new Float32Array(this._bufferSize);
        this._offset     = 0;
        this._active     = true;

        // Allow main thread to stop the processor cleanly
        this.port.onmessage = (e) => {
            if (e.data?.type === 'stop') {
                this._active = false;
            }
        };
    }

    /**
     * Called by the audio engine every 128 samples.
     * MUST return true to keep the processor alive.
     */
    process(inputs) {
        if (!this._active) return false;

        // inputs[0][0] = first input, first channel (mono)
        const channel = inputs?.[0]?.[0];
        if (!channel || channel.length === 0) return true;

        let i = 0;
        while (i < channel.length) {
            // Copy samples into our accumulation buffer
            const remaining   = this._bufferSize - this._offset;
            const toCopy      = Math.min(remaining, channel.length - i);
            this._buffer.set(channel.subarray(i, i + toCopy), this._offset);
            this._offset += toCopy;
            i            += toCopy;

            if (this._offset >= this._bufferSize) {
                // Buffer is full — convert to Int16 PCM and send
                this._flush();
            }
        }

        return true; // keep processor alive
    }

    _flush() {
        const int16 = new Int16Array(this._bufferSize);
        for (let i = 0; i < this._bufferSize; i++) {
            // Clamp to [-1, 1] and scale to Int16 range
            const s    = Math.max(-1, Math.min(1, this._buffer[i]));
            int16[i]   = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        // Transfer ownership (zero-copy) to main thread
        this.port.postMessage(
            { type: 'audio', buffer: int16.buffer },
            [int16.buffer]
        );

        this._offset = 0;
    }
}

registerProcessor('mic-processor', MicProcessor);

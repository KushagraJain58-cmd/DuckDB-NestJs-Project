/* eslint-disable @typescript-eslint/no-explicit-any */
// src/global.d.ts

// Define the SpeechRecognition and webkitSpeechRecognition types
interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly [index: number]: SpeechRecognitionAlternative;
    length: number;
}

interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
}

interface SpeechRecognitionResultList {
    readonly length: number;
    readonly [index: number]: SpeechRecognitionResult;
    item(index: number): SpeechRecognitionResult;
}

interface SpeechRecognition extends EventTarget {
    abort(): void;
    start(): void;
    stop(): void;

    continuous: boolean;
    interimResults: boolean;
    lang: string;

    onaudiostart: (this: SpeechRecognition, ev: Event) => any;
    onaudioend: (this: SpeechRecognition, ev: Event) => any;
    onend: (this: SpeechRecognition, ev: Event) => any;
    onerror: (this: SpeechRecognition, ev: Event) => any;
    onnomatch: (this: SpeechRecognition, ev: Event) => any;
    onresult: (this: SpeechRecognition, ev: SpeechRecognitionEvent) => any;
    onsoundstart: (this: SpeechRecognition, ev: Event) => any;
    onsoundend: (this: SpeechRecognition, ev: Event) => any;
    onspeechstart: (this: SpeechRecognition, ev: Event) => any;
    onspeechend: (this: SpeechRecognition, ev: Event) => any;
    onstart: (this: SpeechRecognition, ev: Event) => any;
}

// Add `webkitSpeechRecognition` as part of the global window object
interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
}

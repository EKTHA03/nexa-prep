import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { useInterview } from '../../hooks/useInterview';
import { useEmotionDetection } from '../../hooks/useEmotionDetection';
import { CameraFeed } from './CameraFeed';
import { TranscriptionDisplay } from './TranscriptionDisplay';
import { InterviewControls } from './InterviewControls';
import { MicrophoneSelector } from './MicrophoneSelector';
import { useNavigate } from 'react-router-dom';
import { StepNavigation } from '../common/StepNavigation';
import { Loader2, AlertCircle, Mic, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../../config/constants';

export function LiveInterviewSession() {
  const { selectedRole } = useApp();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const [selectedMicId, setSelectedMicId] = useState<string>('');
  const [sttError, setSttError] = useState<string | null>(null);
  const [isTranscribingBackend, setIsTranscribingBackend] = useState<boolean>(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [micStatus, setMicStatus] = useState<'listening' | 'silent' | 'denied' | 'ready'>('ready');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const isRecordingRef = useRef(false);
  const recognitionRef = useRef<any>(null);
  const finalTranscriptRef = useRef<string>('');
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const {
    currentIndex,
    currentQuestion,
    totalQuestions,
    transcripts,
    isRecording,
    setIsRecording,
    setQuestionTranscript,
    nextQuestion,
    completeInterviewSession,
  } = useInterview(selectedRole);

  isRecordingRef.current = isRecording;

  const { detectionState, emotionLog } = useEmotionDetection(videoRef, isStreaming);

  // Sync finalTranscriptRef with current transcript when question changes
  useEffect(() => {
    finalTranscriptRef.current = transcripts[currentQuestion.id] || '';
  }, [currentQuestion.id]);

  // Safe getUserMedia helper
  const requestUserMedia = async (constraints: MediaStreamConstraints): Promise<MediaStream> => {
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
      return await navigator.mediaDevices.getUserMedia(constraints);
    }

    const legacyGetUserMedia =
      (navigator as any).getUserMedia ||
      (navigator as any).webkitGetUserMedia ||
      (navigator as any).mozGetUserMedia ||
      (navigator as any).msGetUserMedia;

    if (legacyGetUserMedia) {
      return new Promise((resolve, reject) => {
        legacyGetUserMedia.call(navigator, constraints, resolve, reject);
      });
    }

    throw new Error('Camera & Microphone access requires HTTPS or localhost.');
  };

  // Real-time Audio Level Meter using Web Audio API
  const setupAudioMeter = (stream: MediaStream) => {
    try {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0) return;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.4;
      analyserRef.current = analyser;

      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateMeter = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        // Normalize 0 to 100 with boosted sensitivity for quiet laptop mics
        const normalizedLevel = Math.min(100, Math.round((avg / 64) * 100));
        setAudioLevel(normalizedLevel);

        animFrameRef.current = requestAnimationFrame(updateMeter);
      };

      updateMeter();
    } catch (e) {
      console.warn('AudioContext meter setup failed:', e);
    }
  };

  // Initialize WebCam & Smart Microphone Audio Stream
  const setupMediaStream = async () => {
    setMediaError(null);
    try {
      let stream: MediaStream | null = null;

      let audioConstraint: any = true;
      if (selectedMicId) {
        audioConstraint = { deviceId: { exact: selectedMicId } };
      }

      const videoConstraint: any = {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 },
      };

      try {
        stream = await requestUserMedia({
          video: videoConstraint,
          audio: audioConstraint,
        });
      } catch (firstErr) {
        console.warn('Strict media constraints failed, trying basic video & audio:', firstErr);
        try {
          stream = await requestUserMedia({
            video: true,
            audio: true,
          });
        } catch (secondErr) {
          console.warn('Video + Audio failed, trying video only:', secondErr);
          stream = await requestUserMedia({ video: true });
        }
      }

      if (stream) {
        if (activeStreamRef.current) {
          activeStreamRef.current.getTracks().forEach(t => t.stop());
        }
        activeStreamRef.current = stream;
        setActiveStream(stream);
        setIsStreaming(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.warn('Video play deferred:', e));
        }

        if (stream.getAudioTracks().length > 0) {
          setupAudioMeter(stream);
        }
      }
    } catch (err: any) {
      console.warn('Camera/Mic acquisition failed:', err);
      setMediaError(err?.message || 'Camera or Microphone access was denied or is unavailable on this device.');
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    setupMediaStream();

    return () => {
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach(t => t.stop());
        activeStreamRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [selectedMicId]);

  // Robust Multi-Engine Speech Recognition (Accumulates text & handles continuous speech)
  useEffect(() => {
    let recognition: any = null;

    if (isRecording) {
      setSttError(null);
      setMicStatus('listening');
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';
          recognitionRef.current = recognition;

          recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let currentFinal = finalTranscriptRef.current;

            for (let i = event.resultIndex; i < event.results.length; ++i) {
              const transcriptChunk = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                currentFinal = (currentFinal ? currentFinal + ' ' : '') + transcriptChunk.trim();
                finalTranscriptRef.current = currentFinal;
              } else {
                interimTranscript += transcriptChunk;
              }
            }

            const fullText = (currentFinal + (interimTranscript ? ' ' + interimTranscript : '')).trim();
            if (fullText) {
              setQuestionTranscript(currentQuestion.id, fullText);
            }
          };

          recognition.onerror = (event: any) => {
            console.warn('[Web Speech API Event]:', event.error);
            if (event.error === 'network') {
              setSttError('Web Speech API network timeout. You can speak or type your answer in the box.');
            } else if (event.error === 'not-allowed') {
              setMicStatus('denied');
              setSttError('Microphone Access Blocked in Browser. Please allow mic permissions or type your answer.');
            } else if (event.error === 'no-speech') {
              setMicStatus('silent');
            }
          };

          recognition.onend = () => {
            if (isRecordingRef.current && recognitionRef.current) {
              try {
                recognition.start();
              } catch (e) {}
            }
          };

          recognition.start();
        } catch (e) {
          console.warn('SpeechRecognition init error:', e);
        }
      } else {
        setSttError('Browser Live STT is not supported on this browser. Type your answer directly in the text area.');
      }
    } else {
      setMicStatus('ready');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
        recognitionRef.current = null;
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {}
      }
    };
  }, [isRecording, currentQuestion.id]);

  // Recording toggle with MediaRecorder capture
  const handleToggleRecording = async () => {
    if (!isRecording) {
      setIsRecording(true);
      audioChunksRef.current = [];

      try {
        const streamToRecord = activeStream || (await requestUserMedia({ audio: true }));
        const mediaRecorder = new MediaRecorder(streamToRecord);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.start(250);
      } catch (err) {
        console.warn('MediaRecorder init failed:', err);
      }
    } else {
      setIsRecording(false);

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    }
  };

  const handleNextQuestion = () => {
    nextQuestion();
  };

  const handleFinishEarly = () => {
    completeInterviewSession(emotionLog);
    navigate('/performance');
  };

  const handleToggleCamera = () => {
    if (activeStream) {
      const videoTrack = activeStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsStreaming(videoTrack.enabled);
      }
    } else {
      setupMediaStream();
    }
  };

  const handleTranscriptChange = (text: string) => {
    finalTranscriptRef.current = text;
    setQuestionTranscript(currentQuestion.id, text);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              {selectedRole}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Live Interview Simulation</h1>
        </div>

        <div className="flex items-center gap-3">
          <MicrophoneSelector
            stream={activeStream}
            selectedDeviceId={selectedMicId}
            onSelectDevice={(id) => setSelectedMicId(id)}
          />
          <button
            onClick={handleFinishEarly}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            Complete Session
          </button>
        </div>
      </div>

      {/* STT / Mic Banner if error detected */}
      {sttError && (
        <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl flex items-center gap-2 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-400" />
          <span>{sttError}</span>
        </div>
      )}

      {/* Main Split Grid: Camera Feed + Interview Interaction */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Camera Feed */}
        <div className="space-y-4">
          <CameraFeed
            videoRef={videoRef}
            isStreaming={isStreaming}
            onToggleCamera={handleToggleCamera}
            detectionState={detectionState}
            onEnableCamera={setupMediaStream}
            mediaError={mediaError}
          />
        </div>

        {/* Right Column: Question + Transcription + Controls */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Question</span>
              {isTranscribingBackend && (
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing Speech...</span>
                </div>
              )}
            </div>

            <p className="text-lg font-extrabold text-white leading-relaxed">
              {currentQuestion.question}
            </p>
          </div>

          <TranscriptionDisplay
            transcript={transcripts[currentQuestion.id] || ''}
            isRecording={isRecording}
            onTranscriptChange={handleTranscriptChange}
            audioLevel={audioLevel}
            micStatus={micStatus}
          />

          <InterviewControls
            isRecording={isRecording}
            onToggleRecord={handleToggleRecording}
            onNextQuestion={handleNextQuestion}
            onFinishInterview={handleFinishEarly}
            isLastQuestion={currentIndex === totalQuestions - 1}
          />
        </div>
      </div>

      <StepNavigation currentPath="/interview" />
    </div>
  );
}

export default LiveInterviewSession;

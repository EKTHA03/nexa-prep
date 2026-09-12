import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, AlertCircle } from 'lucide-react';

interface AudioDeviceOption {
  deviceId: string;
  label: string;
}

interface MicrophoneSelectorProps {
  stream: MediaStream | null;
  selectedDeviceId: string;
  onSelectDevice: (deviceId: string) => void;
}

export function MicrophoneSelector({
  stream,
  selectedDeviceId,
  onSelectDevice,
}: MicrophoneSelectorProps) {
  const [devices, setDevices] = useState<AudioDeviceOption[]>([]);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // 1. Enumerate and filter audio input devices
  useEffect(() => {
    async function loadDevices() {
      try {
        if (!navigator.mediaDevices || typeof navigator.mediaDevices.enumerateDevices !== 'function') {
          setDevices([{ deviceId: 'default', label: 'Default Microphone' }]);
          return;
        }
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = deviceList.filter(d => d.kind === 'audioinput');

        // Filter out virtual/loopback audio entries (e.g. Stereo Mix, Loopback)
        const filtered = audioInputs.filter(d => {
          const label = d.label.toLowerCase();
          return !label.includes('stereo mix') && !label.includes('loopback') && !label.includes('what u hear');
        });

        const usableList = filtered.length > 0 ? filtered : audioInputs;

        const options: AudioDeviceOption[] = usableList.map((d, index) => ({
          deviceId: d.deviceId,
          label: d.label || `Microphone ${index + 1}`
        }));

        setDevices(options);
      } catch (err) {
        console.warn('Failed to enumerate audio devices:', err);
      }
    }

    loadDevices();
    if (navigator.mediaDevices && typeof navigator.mediaDevices.addEventListener === 'function') {
      navigator.mediaDevices.addEventListener('devicechange', loadDevices);
    }
    return () => {
      if (navigator.mediaDevices && typeof navigator.mediaDevices.removeEventListener === 'function') {
        navigator.mediaDevices.removeEventListener('devicechange', loadDevices);
      }
    };
  }, []);

  // 2. Setup AudioContext AnalyserNode for live VU volume level bar
  useEffect(() => {
    if (!stream) {
      setVolumeLevel(0);
      return;
    }

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      setVolumeLevel(0);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        // Normalize 0-128 average volume to 0-100% level
        const normalized = Math.min(100, Math.round((average / 60) * 100));
        setVolumeLevel(normalized);

        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err) {
      console.warn('AudioContext volume meter setup failed:', err);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [stream]);

  return (
    <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <Mic className="w-4 h-4 text-cyan-400" />
          <span>Microphone Input Device</span>
        </label>

        <select
          value={selectedDeviceId}
          onChange={(e) => onSelectDevice(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 max-w-xs transition cursor-pointer"
        >
          {devices.map((d) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {/* Live VU Volume Meter */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
          <span className="flex items-center gap-1.5">
            <Volume2 className={`w-3.5 h-3.5 ${volumeLevel > 5 ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            Live Mic Volume Input Level
          </span>
          <span className="font-mono text-cyan-400">{volumeLevel}%</span>
        </div>

        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-75 ${
              volumeLevel > 50
                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400'
                : volumeLevel > 10
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-500'
                : 'bg-slate-700'
            }`}
            style={{ width: `${Math.max(3, volumeLevel)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

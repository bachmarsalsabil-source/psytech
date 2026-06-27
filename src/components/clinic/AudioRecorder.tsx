import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Trash2, CheckCircle, Volume2 } from 'lucide-react';
import { GoldButton } from './GoldButton';

interface AudioRecorderProps {
  onSave: (audioData: string) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onSave }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setAudioUrl(base64data);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Mic access denied", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    if (audioUrl) {
      onSave(audioUrl);
    }
  };

  return (
    <div className="p-10 glass rounded-3xl border-[#D4B483]/30 bg-[#D4B483]/5 text-center space-y-8">
      <h3 className="text-xl font-bold flex items-center justify-center gap-3">
        <Volume2 className="text-[#D4B483]" /> تسجيل صوتي
      </h3>

      <div className="flex flex-col items-center gap-6">
        <div className={`
          w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500
          ${isRecording ? 'bg-red-500/20 scale-110 shadow-[0_0_50px_rgba(239,68,68,0.3)]' : 'bg-[#D4B483]/10'}
        `}>
          {!isRecording ? (
            <button 
              onClick={startRecording}
              className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center text-white hover:scale-105 transition-transform"
            >
              <Mic size={40} />
            </button>
          ) : (
            <button 
              onClick={stopRecording}
              className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-red-500 animate-pulse"
            >
              <Square size={40} fill="currentColor" />
            </button>
          )}
        </div>

        {isRecording && (
          <div className="text-3xl font-black font-mono text-red-500 animate-pulse">
            {formatTime(recordingTime)}
          </div>
        )}

        {audioUrl && !isRecording && (
          <div className="w-full space-y-6">
             <audio src={audioUrl} controls className="w-full accent-psy-gold" />
             <div className="flex gap-4">
                <GoldButton className="flex-1" onClick={handleSave}>
                  <CheckCircle size={20} /> حفظ التسجيل
                </GoldButton>
                <GoldButton variant="secondary" onClick={() => setAudioUrl(null)}>
                  <Trash2 size={20} /> حذف
                </GoldButton>
             </div>
          </div>
        )}
      </div>

      <p className="text-xs text-psy-text/40">سجّل أفكارك، مشاعرك، أو أحلامك بصوتك للرجوع إليها لاحقاً.</p>
    </div>
  );
};

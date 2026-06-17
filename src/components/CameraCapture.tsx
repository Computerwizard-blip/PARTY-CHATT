import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RotateCw, VideoOff, Check, Upload } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (base64Img: string) => void;
  onClose: () => void;
  language: 'en' | 'sw';
}

export default function CameraCapture({ onCapture, onClose, language }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [loading, setLoading] = useState(true);
  const [hasActivated, setHasActivated] = useState(false);

  const t = {
    en: {
      title: "Take Live Photo",
      capture: "Capture Photo",
      retake: "Retake",
      save: "Use This Photo",
      upload: "Or Upload File",
      error: "Camera access is not available or blocked in this environment. You can upload a photo instead.",
      allowCam: "Please allow camera access.",
      fallback: "Choose File"
    },
    sw: {
      title: "Piga Picha Moja kwa Moja",
      capture: "Piga Picha",
      retake: "Piga Tena",
      save: "Tumia Picha Hii",
      upload: "Au Pakia Faili",
      error: "Kamera haipatikani au imezuiwa hapa. Unaweza kupakia picha kutoka kwa faili.",
      allowCam: "Tafadhali ruhusu matumizi ya kamera.",
      fallback: "Chagua Faili"
    }
  }[language];

  // Start video stream
  async function startCamera() {
    setLoading(true);
    setErrorMsg(null);
    setCapturedImage(null);

    // Stop current stream if any
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode, width: { ideal: 640 }, height: { ideal: 640 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error("Camera access failed", err);
      setErrorMsg(t.error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (hasActivated) {
      startCamera();
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode, hasActivated]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Set canvas dimensions to match video aspect
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 640;
      canvas.width = width;
      canvas.height = height;

      // Draw frames
      ctx.drawImage(video, 0, 0, width, height);
      
      // Convert canvas content to base64 jpeg
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);

      // Stop camera stream tracks to preserve resources
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  };

  const handleRetake = () => {
    startCamera();
  };

  const handleSave = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onCapture(base64);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFacingMode = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-zinc-950 border-3 border-black w-full max-w-sm rounded-[32px] overflow-hidden flex flex-col shadow-[4px_4px_0px_rgba(0,0,0,1)] relative">
        
        {/* Header */}
        <div className="border-b-3 border-black p-4 flex items-center justify-between bg-zinc-900">
          <h3 className="font-extrabold text-white text-sm uppercase tracking-wider flex items-center gap-2">
            <Camera className="w-4 h-4 text-yellow-400" />
            {t.title}
          </h3>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white border border-transparent hover:border-zinc-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Camera Stage */}
        <div className="relative aspect-square w-full bg-black flex items-center justify-center overflow-hidden border-b-3 border-black">
          
          {!hasActivated ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-zinc-950">
              <Camera className="w-12 h-12 text-yellow-400 mb-3 animate-pulse" />
              <h4 className="text-sm font-extrabold text-white uppercase tracking-wider mb-2">
                {language === 'en' ? "Camera Ready" : "Kamera Ipo Tayari"}
              </h4>
              <p className="text-[11px] text-zinc-500 font-bold mb-6 leading-normal max-w-[245px]">
                {language === 'en' 
                  ? "Click Activate below to authorize camera access and capture your live photo profile vibe!" 
                  : "Bonyeza Anzisha hapa chini ili kuruhusu kamera na kupiga picha ya wasifu wako!"
                }
              </p>
              
              <button
                type="button"
                onClick={() => setHasActivated(true)}
                className="bg-yellow-400 hover:bg-yellow-300 border-2 border-black text-black font-black text-xs px-5 py-2.5 rounded-xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition flex items-center gap-2"
              >
                <Camera className="w-4 h-4 fill-current" />
                <span>{language === 'en' ? "ACTIVATE CAMERA" : "ANZISHA KAMERA"}</span>
              </button>
            </div>
          ) : (
            <>
              {loading && !capturedImage && !errorMsg && (
                <div className="absolute inset-x-0 inset-y-0 flex flex-col items-center justify-center gap-2 bg-zinc-955 z-20">
                  <div className="w-8 h-8 rounded-full border-3 border-amber-400 border-t-transparent animate-spin"></div>
                  <span className="text-zinc-500 font-mono text-[10px] uppercase">Accessing Camera Lens...</span>
                </div>
              )}

              {errorMsg && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-zinc-950 z-20">
                  <VideoOff className="w-12 h-12 text-rose-500 mb-2" />
                  <p className="text-xs text-zinc-400 leading-relaxed font-semibold mb-4">
                    {errorMsg}
                  </p>
                  
                  {/* Fallback File System Upload Button inside the stage */}
                  <label className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 border-2 border-black text-black font-black text-xs px-4 py-2 rounded-xl shadow-[2px_2px_0_0_rgb(0,0,0)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition">
                    <Upload className="w-4 h-4" />
                    {t.fallback}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              )}

              {/* Captured Image Preview */}
              {capturedImage ? (
                <img 
                  src={capturedImage} 
                  alt="snapshot" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                /* Live Web Camera View */
                !errorMsg && (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                )
              )}

              {/* Facing Camera Switch Button (user / environment) */}
              {!capturedImage && !errorMsg && !loading && (
                <button
                  type="button"
                  onClick={toggleFacingMode}
                  className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full border border-zinc-700 backdrop-blur-sm z-10 transition cursor-pointer"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-zinc-900 flex flex-col gap-3">
          {capturedImage ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleRetake}
                className="bg-zinc-800 hover:bg-zinc-700 border-2 border-black text-white font-extrabold text-xs py-2.5 rounded-xl shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition"
              >
                🔄 {t.retake}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="bg-emerald-500 hover:bg-emerald-400 border-2 border-black text-white font-black text-xs py-2.5 rounded-xl shadow-[2px_2px_0_0_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                {t.save}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* If cam is loaded and active, show Capture */}
              {hasActivated && !errorMsg && !loading && (
                <button
                  type="button"
                  onClick={handleCapture}
                  className="bg-yellow-400 hover:bg-yellow-300 border-3 border-black text-black font-black text-xs py-3 rounded-2xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] active:translate-x-[1.5px] active:translate-y-[1.5px] cursor-pointer transition flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5 fill-current" />
                  {t.capture}
                </button>
              )}

              {!hasActivated && (
                <button
                  type="button"
                  onClick={() => setHasActivated(true)}
                  className="bg-yellow-400/50 cursor-pointer hover:bg-yellow-400 border-3 border-black text-black font-black text-xs py-3 rounded-2xl shadow-[3px_3px_0_0_rgba(0,0,0,1)] transition flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5 fill-current" />
                  <span>{language === 'en' ? "Open Camera Lens" : "Fungua Kamera"}</span>
                </button>
              )}

              {hasActivated && (loading || errorMsg) && (
                <button
                  type="button"
                  disabled
                  className="bg-zinc-805 border-2 border-zinc-700 text-zinc-500 font-extrabold text-xs py-3 rounded-2xl flex items-center justify-center gap-2 cursor-not-allowed select-none"
                >
                  <Camera className="w-5 h-5 text-zinc-650" />
                  <span>{t.capture}</span>
                </button>
              )}

              {/* Always show File Selector choice in bottom controls for flexibility */}
              <div className="flex items-center justify-center gap-2 py-1 select-none">
                <span className="h-[1px] flex-1 bg-zinc-800"></span>
                <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest">{t.upload}</span>
                <span className="h-[1px] flex-1 bg-zinc-800"></span>
              </div>

              <label className="bg-zinc-950 hover:bg-zinc-850 border-2 border-zinc-800 text-zinc-300 font-extrabold text-xs py-2 rounded-xl text-center cursor-pointer transition flex items-center justify-center gap-2">
                <Upload className="w-4 h-4 text-zinc-500" />
                {t.fallback}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            </div>
          )}
        </div>

        {/* Hidden rendering canvas */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

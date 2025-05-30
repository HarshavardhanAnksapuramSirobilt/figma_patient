import React, { useEffect, useRef, useState } from "react";

type QRCodeScannerProps = {
  onScan: (data: string) => void;
  onError?: (error: Error) => void;
  onCancel: () => void;
};

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onScan,
  onError,
  onCancel,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startScanner = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsScanning(true);
          scanQRCode();
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setHasCamera(false);
        if (onError) onError(error);
      }
    };

    startScanner();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onError]);

  const scanQRCode = () => {
    if (!isScanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // This is a mock implementation - in a real app, you'd use a QR code library
    // like jsQR or a service worker with BarcodeDetector API
    
    // For demo purposes, we'll simulate finding a QR code after 3 seconds
    setTimeout(() => {
      if (isScanning) {
        // Mock QR code data
        const mockQRData = "98765432101234"; // ABHA number
        onScan(mockQRData);
      }
    }, 3000);
  };

  return (
    <div className="qr-scanner">
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full h-64 bg-black rounded-lg"
          autoPlay
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          style={{ display: "none" }}
        />
        
        {/* Scanning overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 border-2 border-white rounded-lg relative">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500"></div>
          </div>
        </div>
      </div>

      {!hasCamera && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          Camera access is required for QR scanning. Please allow camera access or try another method.
        </div>
      )}

      <div className="mt-4 flex justify-between">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            if (videoRef.current?.srcObject) {
              const stream = videoRef.current.srcObject as MediaStream;
              stream.getTracks().forEach((track) => track.stop());
            }
            setIsScanning(false);
          }}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Stop Scanning
        </button>
      </div>
    </div>
  );
};

export default QRCodeScanner;
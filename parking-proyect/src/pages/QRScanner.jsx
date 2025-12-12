import React, { useRef, useEffect, useState } from "react";
import jsQR from "jsqr";

const QRScannerPage = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [message, setMessage] = useState("Esperando QR...");
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
  try {
    const constraints = { video: { facingMode: "environment" } };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.setAttribute("playsinline", true);
      await videoRef.current.play();
      setCameraActive(true);
      requestAnimationFrame(tick);
    }
  } catch (err) {
    console.error("Error accediendo a la cámara:", err);
    alert(
      "No se pudo acceder a la cámara. Revisa los permisos o que tu navegador soporte getUserMedia sobre HTTP/HTTPS."
    );
  }
};

    const tick = () => {
      if (!cameraActive) return;

      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
          setMessage(code.data);
          // Redirige automáticamente si es link
          if (code.data.startsWith("http")) {
            window.location.href = code.data;
          }
        }
      }
      requestAnimationFrame(tick);
    };

    startCamera();
  }, [cameraActive]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Escanea el QR del ticket</h2>
      <video
        ref={videoRef}
        style={{ width: "100%", border: "1px solid #ccc", borderRadius: "8px" }}
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <p>{message}</p>
    </div>
  );
};

export default QRScannerPage;

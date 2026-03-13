import { useCallback, useEffect, useRef, useState } from "react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// Thresholds (tuned to avoid false positives on natural glances)
const HEAD_YAW_THRESHOLD = 35; // degrees — head turned left/right
const HEAD_PITCH_THRESHOLD = 30; // degrees — head tilted up/down
const SUSTAINED_MS = 4000; // must persist 4s before triggering
const DETECTION_INTERVAL_MS = 500; // run face detection every 500ms
const COOLDOWN_MS = 15000; // 15s cooldown between same-type violations

/**
 * useFaceProctoring — MediaPipe-based face monitoring.
 *
 * Detects:
 *   - face_not_detected (no face for 4s)
 *   - multiple_faces (2+ faces for 4s)
 *   - looking_away (head turned beyond threshold for 4s)
 *
 * @param {React.RefObject<HTMLVideoElement>} videoRef — ref to the candidate's <video> element
 * @param {boolean} enabled — master switch
 * @param {(type: string, details: string, duration?: number) => void} onViolation — callback when violation fires
 * @returns {{ faceStatus: string, isReady: boolean }}
 */
export default function useFaceProctoring(videoRef, enabled = true, onViolation = null) {
  const [faceStatus, setFaceStatus] = useState("ok"); // ok | no_face | multiple | looking_away
  const [isReady, setIsReady] = useState(false);

  const landmarkerRef = useRef(null);
  const intervalRef = useRef(null);
  const lastViolationTimeRef = useRef({});
  const sustainedRef = useRef({ type: null, since: null });

  // Fire violation (with cooldown)
  const fireViolation = useCallback(
    (type, details, duration) => {
      const now = Date.now();
      const lastTime = lastViolationTimeRef.current[type] || 0;
      if (now - lastTime < COOLDOWN_MS) return;
      lastViolationTimeRef.current[type] = now;

      if (onViolation) {
        onViolation(type, details, duration);
      }
    },
    [onViolation]
  );

  // Init MediaPipe FaceLandmarker
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const init = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        if (cancelled) return;

        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numFaces: 3,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false,
        });
        if (cancelled) return;

        landmarkerRef.current = landmarker;
        setIsReady(true);
        console.log("[FaceProctoring] MediaPipe FaceLandmarker ready");
      } catch (err) {
        console.warn("[FaceProctoring] Init failed — face detection disabled:", err.message);
      }
    };

    init();

    return () => {
      cancelled = true;
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
        landmarkerRef.current = null;
      }
      setIsReady(false);
    };
  }, [enabled]);

  // Detection loop
  useEffect(() => {
    if (!enabled || !isReady) return;

    const detect = () => {
      const video = videoRef?.current;
      const landmarker = landmarkerRef.current;

      if (!video || !landmarker || video.readyState < 2 || video.videoWidth === 0) return;

      try {
        const result = landmarker.detectForVideo(video, performance.now());
        const faceCount = result.faceLandmarks?.length ?? 0;
        const now = Date.now();

        if (faceCount === 0) {
          checkSustained("face_not_detected", now);
          setFaceStatus("no_face");
          return;
        }

        if (faceCount > 1) {
          checkSustained("multiple_faces", now);
          setFaceStatus("multiple");
          return;
        }

        // Single face — check head pose
        const landmarks = result.faceLandmarks[0];
        const yaw = estimateYaw(landmarks);
        const pitch = estimatePitch(landmarks);

        if (Math.abs(yaw) > HEAD_YAW_THRESHOLD || Math.abs(pitch) > HEAD_PITCH_THRESHOLD) {
          checkSustained("looking_away", now);
          setFaceStatus("looking_away");
          return;
        }

        // All good
        sustainedRef.current = { type: null, since: null };
        setFaceStatus("ok");
      } catch {
        // Silently handle — video might not be ready
      }
    };

    const checkSustained = (type, now) => {
      const cur = sustainedRef.current;

      if (cur.type !== type) {
        sustainedRef.current = { type, since: now };
        return;
      }

      if (now - cur.since >= SUSTAINED_MS) {
        const durationSec = Math.round((now - cur.since) / 1000);
        fireViolation(type, `${type} sustained for ${durationSec}s`, durationSec);
        sustainedRef.current = { type: null, since: null };
      }
    };

    intervalRef.current = setInterval(detect, DETECTION_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, isReady, videoRef, fireViolation]);

  return { faceStatus, isReady };
}

// ── Head pose estimation from MediaPipe 468 landmarks ──

function estimateYaw(landmarks) {
  const nose = landmarks[1];
  const leftCheek = landmarks[234];
  const rightCheek = landmarks[454];
  const midX = (leftCheek.x + rightCheek.x) / 2;
  const faceWidth = Math.abs(rightCheek.x - leftCheek.x);
  if (faceWidth < 0.01) return 0;
  return ((nose.x - midX) / faceWidth) * 90;
}

function estimatePitch(landmarks) {
  const nose = landmarks[1];
  const forehead = landmarks[10];
  const chin = landmarks[152];
  const midY = (forehead.y + chin.y) / 2;
  const faceHeight = Math.abs(chin.y - forehead.y);
  if (faceHeight < 0.01) return 0;
  return ((nose.y - midY) / faceHeight) * 90;
}

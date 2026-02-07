import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const rootRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!root || !dot || !ring) return undefined;

    const state = {
      x: 0,
      y: 0,
      ringX: 0,
      ringY: 0,
      targetX: 0,
      targetY: 0,
      visible: false,
    };

    const setTarget = (event) => {
      state.targetX = event.clientX;
      state.targetY = event.clientY;
      if (!state.visible) {
        state.x = state.targetX;
        state.y = state.targetY;
        state.ringX = state.targetX;
        state.ringY = state.targetY;
        state.visible = true;
        root.classList.add("cursor-visible");
      }
    };

    const update = () => {
      state.x += (state.targetX - state.x) * 0.3;
      state.y += (state.targetY - state.y) * 0.3;
      state.ringX += (state.targetX - state.ringX) * 0.16;
      state.ringY += (state.targetY - state.ringY) * 0.16;

      dot.style.setProperty("--x", `${state.x}px`);
      dot.style.setProperty("--y", `${state.y}px`);
      ring.style.setProperty("--x", `${state.ringX}px`);
      ring.style.setProperty("--y", `${state.ringY}px`);

      rafRef.current = requestAnimationFrame(update);
    };

    const handleDown = () => root.classList.add("cursor-pressed");
    const handleUp = () => root.classList.remove("cursor-pressed");
    const handleEnter = () => root.classList.add("cursor-visible");
    const handleLeave = () => root.classList.remove("cursor-visible");

    document.addEventListener("pointermove", setTarget, { passive: true });
    document.addEventListener("pointerdown", handleDown);
    document.addEventListener("pointerup", handleUp);
    document.addEventListener("mouseenter", handleEnter);
    document.addEventListener("mouseleave", handleLeave);
    window.addEventListener("blur", handleLeave);

    rafRef.current = requestAnimationFrame(update);

    return () => {
      document.removeEventListener("pointermove", setTarget);
      document.removeEventListener("pointerdown", handleDown);
      document.removeEventListener("pointerup", handleUp);
      document.removeEventListener("mouseenter", handleEnter);
      document.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("blur", handleLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={rootRef} className="custom-cursor-shell" aria-hidden="true">
      <div ref={ringRef} className="custom-cursor-ring" />
      <div ref={dotRef} className="custom-cursor-dot" />
    </div>
  );
};

export default CustomCursor;

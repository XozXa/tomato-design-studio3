import { RefObject, useEffect, useRef } from "react";

export const useMousePositionRef = (
  containerRef?: RefObject<HTMLElement | null | SVGElement>
) => {
  const positionRef = useRef({ x: 0, y: 0 });
  const pendingRef = useRef<{ x: number; y: number } | null>(null);
  const scheduledRef = useRef(false);
  const rectRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    const flush = () => {
      scheduledRef.current = false;
      const pending = pendingRef.current;
      if (!pending) return;

      if (containerRef?.current) {
        const rect =
          rectRef.current ?? containerRef.current.getBoundingClientRect();
        rectRef.current = rect;
        positionRef.current = {
          x: pending.x - rect.left,
          y: pending.y - rect.top,
        };
      } else {
        positionRef.current = { x: pending.x, y: pending.y };
      }
    };

    const schedule = (x: number, y: number) => {
      pendingRef.current = { x, y };
      if (scheduledRef.current) return;
      scheduledRef.current = true;
      requestAnimationFrame(flush);
    };

    const handleMouseMove = (ev: MouseEvent) => {
      schedule(ev.clientX, ev.clientY);
    };

    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (!touch) return;
      schedule(touch.clientX, touch.clientY);
    };

    // Refresh the cached rect on resize/scroll so we don't re-measure on every move.
    const refreshRect = () => {
      rectRef.current = containerRef?.current
        ? containerRef.current.getBoundingClientRect()
        : null;
    };
    refreshRect();

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("resize", refreshRect, { passive: true });
    window.addEventListener("scroll", refreshRect, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", refreshRect);
      window.removeEventListener("scroll", refreshRect);
    };
  }, [containerRef]);

  return positionRef;
};

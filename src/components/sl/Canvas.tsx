"use client";

import { assertIfNull } from "@/asserts";
import { useCallback, useEffect, useRef } from "react";
import s from "./Canvas.module.css";
import SL from "./assets/sl";

export default function Canvas() {
  const refState = useRef<(() => void) | null>(null);
  const refCanvas = useRef<HTMLCanvasElement>(null);
  const onClickRun = useCallback(function onClickRun() {
    refState.current?.();
  }, []);
  useEffect(() => {
    const main = async () => {
      assertIfNull(refCanvas.current);

      const sl = await SL({
        canvas: refCanvas.current,
      });
      sl.specialHTMLTargets["#canvas"] = refCanvas.current;
      const title = document.title;
      sl.callMain();
      document.title = title;

      const cols = sl._get_cols();

      let state: { t: number; x: number } | null = null;
      refState.current = () => {
        state = { t: Date.now(), x: cols };
      };

      let finished = false;
      function update() {
        if (finished) {
          return;
        }

        requestAnimationFrame(update);

        if (state == null) {
          return;
        }

        const x = (cols - 1 - (Date.now() - state.t) / 40) | 0;
        if (state.x !== x) {
          state = sl._update(x) !== -1 ? { ...state, x } : null;
        }

        return function cleanup() {
          finished = true;
        };
      }
      requestAnimationFrame(update);
    };
    main();
  }, []);
  return (
    <div className={s.container}>
      <canvas className={s.canvas} ref={refCanvas} />
      <button onClick={onClickRun} className={s.transparent} />
    </div>
  );
}

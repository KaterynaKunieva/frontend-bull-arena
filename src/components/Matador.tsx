import { useEffect, useState, useRef, useCallback, memo } from "react";

type BullRunEvent = CustomEvent<{ position: number }>;

declare global {
  interface DocumentEventMap {
    bullRun: BullRunEvent;
  }
}

type MatadorProps = {
  applause: number;
  matadorPosition: number;
  setMatarodPosition: (position: number | ((prev: number) => number)) => void;
};

export const Matador = memo(
  (props: Partial<MatadorProps>) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    // handle moving
    const bullRunHandler = useCallback(
      (e: BullRunEvent) => {
        if (
          typeof props.matadorPosition === "undefined" ||
          typeof props.setMatarodPosition === "undefined"
        ) {
          return;
        }

        const bullPosition = e.detail.position;

        if (bullPosition === props.matadorPosition) {
          let newPosition = props.matadorPosition;
          while (bullPosition === newPosition) {
            newPosition = Math.floor(Math.random() * 9);
          }
          props.setMatarodPosition(() => {
            console.log(
              `Matador is moving from ${props.matadorPosition} to ${newPosition}`,
            );
            return newPosition;
          });
        }
      },
      [props.matadorPosition, props.setMatarodPosition],
    );

    useEffect(() => {
      document.addEventListener("bullRun", bullRunHandler);

      return () => {
        document.removeEventListener("bullRun", bullRunHandler);
      };
    }, [bullRunHandler]);

    // handle applause
    useEffect(() => {
      const audio = audioRef.current;

      if (audio) {
        audio.play().catch(() => {
          console.log(`Error playing applause`);
        });
      }

      return () => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      };
    }, [props.applause]);

    return (
      <>
        <img src="matador.svg" />
        <audio
          ref={audioRef}
          style={{ display: "none" }}
          src={`applause-${props.applause}.wav`}
          autoPlay
          controls
        ></audio>
      </>
    );
  },
  (prevProps, nextProps) => {
    // don't render conditions
    if (
      (prevProps.applause !== nextProps.applause && nextProps.applause !== 3) || // next is not 3
      (prevProps.applause === 3 && nextProps.applause === 3) // prev and next is 3
    ) {
      return true;
    }

    // simple props comparison
    return (
      prevProps.applause === nextProps.applause &&
      prevProps.matadorPosition === nextProps.matadorPosition &&
      prevProps.setMatarodPosition === nextProps.setMatarodPosition
    );
  },
);

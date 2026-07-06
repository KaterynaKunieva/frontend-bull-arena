import { useEffect, useState, useRef, useCallback, memo } from "react";

type BullRunEvent = CustomEvent<{position: number}>; 

type MatadorProps = {
  applause: number;
  matadorPosition: number;
  setMatarodPosition: (position: number | ((prev: number) => number)) => void;
}

function usePrevious<T>(value: T): T | undefined { 
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export const Matador = memo((props: Partial<MatadorProps>) => {  

  const [_, setApplause] = useState(false);
  const prevApplause = usePrevious(props.applause); 
  const audioRef = useRef<HTMLAudioElement>(null);

  // handle moving 
  const bullRunHandler = useCallback((event: Event) => {
    if (typeof props.matadorPosition === "undefined" || typeof props.setMatarodPosition === "undefined") {
      return;
    }

    const e = event as BullRunEvent;
    const bullPosition = e.detail.position;

    if (bullPosition === props.matadorPosition) {
      let newPosition = props.matadorPosition;
      while (bullPosition === newPosition) {
        newPosition = Math.floor(Math.random() * 9);
      }
      props.setMatarodPosition(() => {
        console.log(`Matador is moving from ${props.matadorPosition} to ${newPosition}`);
        return newPosition;
      });
    }
  }, [props.matadorPosition, props.setMatarodPosition]);
  
  useEffect(() => {
    document.addEventListener("bullRun", bullRunHandler);
    
    return () => {
      document.removeEventListener("bullRun", bullRunHandler);
    }
    
  }, [bullRunHandler]); 
  
  // handle applause 
  useEffect(() => {
    const audio = audioRef.current; 
    
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);
    
  useEffect(() => {
    if (props.applause === 3 && prevApplause !== 3) {
      setApplause((prev) => !prev);
      const audio = audioRef.current;
      if (audio) {
        audio.play().catch(() => {
          console.log(`Error playing applause`);
        });
      }
    }
  }, [props.applause]);

  return <>
    <img src="matador.svg" /> 
    {/* <audio ref={audioRef} style={{ display: "none" }} src={`applause-3.wav`} autoPlay controls></audio> */}
  </>;
});
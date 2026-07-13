import { Component, createRef } from "react";

type MatadorProps = {
  applause: number;
  matadorPosition: number;
  setMatarodPosition: (position: number | ((prev: number) => number)) => void;
};

type MatadorState = {
  applause: boolean;
};

type BullRunEvent = CustomEvent<{ position: number }>;

declare global {
  interface DocumentEventMap {
    bullRun: BullRunEvent;
  }
}

export class OldMatador extends Component<Partial<MatadorProps>, MatadorState> {
  private audioRef: React.RefObject<HTMLAudioElement> =
    createRef<HTMLAudioElement>();

  constructor(props: Partial<MatadorProps>) {
    super(props);
    this.audioRef = createRef<HTMLAudioElement>();
    this.state = {
      applause: false,
    };
  }

  componentDidMount() {
    // handle moving
    document.addEventListener("bullRun", this.bullRunHandler);
  }

  componentWillUnmount() {
    // handle moving
    document.removeEventListener("bullRun", this.bullRunHandler);

    // handle applause
    const audio = this.audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  shouldComponentUpdate(nextProps: Partial<MatadorProps>) {
    // don't render conditions
    if (
      (this.props.applause !== nextProps.applause &&
        nextProps.applause !== 3) || // next is not 3
      (this.props.applause === 3 && nextProps.applause === 3) // prev and next is 3
    ) {
      return false;
    } else {
      const audio = this.audioRef.current;
      if (audio) {
        audio.play().catch(() => {
          console.log(`Error playing applause`);
        });
      }
    }

    // simple props comparison
    return (
      nextProps.applause !== nextProps.applause ||
      nextProps.matadorPosition !== nextProps.matadorPosition ||
      nextProps.setMatarodPosition !== nextProps.setMatarodPosition
    );
  }

  private bullRunHandler = (event: Event) => {
    if (
      typeof this.props.matadorPosition === "undefined" ||
      typeof this.props.setMatarodPosition === "undefined"
    ) {
      return;
    }

    const e = event as BullRunEvent;
    const bullPosition = e.detail.position;

    if (bullPosition === this.props.matadorPosition) {
      let newPosition = this.props.matadorPosition;
      while (bullPosition === newPosition) {
        newPosition = Math.floor(Math.random() * 9);
      }
      this.props.setMatarodPosition(() => {
        console.log(
          `Matador is moving from ${this.props.matadorPosition} to ${newPosition}`,
        );
        return newPosition;
      });
    }
  };

  render() {
    return (
      <>
        <img src="matador.svg" />
        <audio
          ref={this.audioRef}
          style={{ display: "none" }}
          src={`applause-3.wav`}
          autoPlay
          controls
        ></audio>
      </>
    );
  }
}

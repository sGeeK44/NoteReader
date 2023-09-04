import Sound from "react-native-sound";

export default class Metronome {
    intervalId: NodeJS.Timeout | undefined;
    tick = new Sound('baguettes.mp3', Sound.MAIN_BUNDLE);
    tempo: number;

    constructor() {
        this.tempo = 60;
        Sound.setCategory('Playback');
    }

    startPlay(): void {
        this.intervalId = setInterval(() => {
            this.tick.play();
        }, (this.tempo / 60) * 1000);
    }

    stopPlay(): void {
        clearInterval(this.intervalId);
    }

    setNewTempo(tempo: number) {
        this.tempo = tempo;
    }
}
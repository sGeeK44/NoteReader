import {
  Measure,
  MusicScore,
  Notes,
} from 'app/domain/services/MusicScoreBuilder';
import { toString } from 'app/domain/value-object/Signature';
import { Flow, Formatter, Stave, StaveNote, Tickable, Voice } from 'vexflow';
import { RnSvgContext } from './RnSvgContext';

export class VexflowScore {
  constructor(private voices: Voice[] = []) { }

  addVoice(voice: Voice) {
    this.voices.push(voice);
  }

  draw(context: RnSvgContext | undefined) {
    this.voices.forEach(voice => {
      const stave = voice.getStave();
      if (stave === undefined) {
        return;
      }
      stave.setContext(context);
      stave.draw();
      voice.draw(context);
    });
  }

  drawGoodNote(context: RnSvgContext | undefined, measure: number, note: number) {
    this.drawNote(context, measure, note, "green");
  }

  drawBadNote(context: RnSvgContext | undefined, measure: number, note: number) {
    this.drawNote(context, measure, note, "red");
  }

  resetNote(context: RnSvgContext | undefined, measure: number) {
    const voice = this.voices[measure - 1];
    voice.getTickables().forEach(note => {
      this.setColorNote(note, "black");

    });
    voice.draw(context);
  }

  drawNote(context: RnSvgContext | undefined, measure: number, note: number, color: string) {
    const voice = this.voices[measure - 1];
    const good = voice.getTickables()[note - 1];
    this.setColorNote(good, color);
    voice.draw(context);
  }

  setColorNote(note: Tickable, color: string) {
    note.setStyle({ fillStyle: color, strokeStyle: color });
  }
}

export class VexflowConverter {
  private formatter: Formatter = new Formatter();

  toVexflow(
    score: MusicScore,
    settings: { width: number; measurePerLine: number },
  ): VexflowScore {
    const staveWidth = settings.width / settings.measurePerLine;
    const staveLines = this.split(score.measures, settings.measurePerLine);
    let y = 0;
    const result = new VexflowScore();
    staveLines.forEach(line => {
      let x = 0;
      let voice: Voice;
      line.forEach((measure, i) => {
        voice = this.createStave(score, measure.notes, x, y, staveWidth);
        const stave = voice.getStave();
        if (stave === undefined) {
          throw new Error();
        }
        x += stave.getWidth();
        result.addVoice(voice);
        if (i === line.length - 1) {
          y += stave.getHeight();
        }
      });
    });
    return result;
  }

  drawGoodNote(score: MusicScore, measure: Measure,): void {
    this.createStave(score, measure.notes, 0, 0, 200);
  }

  createStave(
    score: MusicScore,
    notes: Notes[],
    x: number,
    y: number,
    staveWidth: number,
  ): Voice {
    const stave = new Stave(x, y, staveWidth);

    if (x === 0 && y === 0) {
      stave.setClef(score.clef);
      stave.setTimeSignature(toString(score.timeSignature));
    }
    return this.createNotes(stave, score, notes);
  }

  createNotes(
    stave: Stave,
    score: MusicScore,
    notes: Notes[]
  ): Voice {
    const notesToDraw = notes.map(note => this.createNote(score, note));

    const voice = new Voice({
      num_beats: score.timeSignature.beat,
      beat_value: score.timeSignature.duration,
      resolution: Flow.RESOLUTION,
    });
    voice.addTickables([...notesToDraw]);
    this.formatter.formatToStave([voice], stave, { auto_beam: true });
    voice.setStave(stave);
    return voice;
  }

  createNote(score: MusicScore, note: Notes): StaveNote {
    const result = new StaveNote({
      clef: score.clef,
      keys: [`${note.notehead}/${note.pitch}`],
      duration: note.duration.toString(),
    });
    return result;
  }

  split(notes: Measure[], chunkSize: number): Measure[][] {
    const result = [];
    for (let i = 0; i < notes.length; i += chunkSize) {
      const chunk = notes.slice(i, i + chunkSize);
      result.push(chunk);
    }
    return result;
  }
}

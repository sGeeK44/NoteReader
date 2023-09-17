import {
  Measure,
  MusicScore,
  Notes,
} from 'app/domain/services/MusicScoreBuilder';
import { toString } from 'app/domain/value-object/Signature';
import { Flow, Formatter, RenderContext, Stave, StaveNote, Tickable, Voice } from 'vexflow';

export class VexflowConverter {
  private formatter: Formatter = new Formatter();

  toVexflow(
    score: MusicScore,
    settings: { width: number; measurePerLine: number },
  ): Voice[] {
    const staveWidth = settings.width / settings.measurePerLine;
    const staveLines = this.split(score.measures, settings.measurePerLine);
    let y = 0;
    const result: Voice[] = [];
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
        result.push(voice);
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

  setColorNote(note: Tickable, color: string) {
    note.setStyle({ fillStyle: color, strokeStyle: color });
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

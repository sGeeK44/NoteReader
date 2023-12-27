import {
  Clef,
  Measure,
  MusicScore,
} from 'app/domain/services/MusicScoreBuilder';
import { Notes } from 'app/domain/services/Notes';
import { Signature, toString } from 'app/domain/value-object/Signature';
import {
  Beam,
  Dot,
  Flow,
  Formatter,
  Stave,
  StaveNote,
  Tickable,
  Voice,
  VoiceMode,
  VoiceTime,
} from 'vexflow';
import { RnSvgContext } from './RnSvgContext';
import { RhytmicNoteRecognizer } from './RhytmicNoteRecognizer';

export class VexflowScore {
  constructor(private voices: Voice[] = [], private beams: Beam[] = []) { }

  addVoice(voice: Voice) {
    this.voices.push(voice);
  }

  addBeams(beams: Beam[]) {
    this.beams.push(...beams);
  }

  draw(context: RnSvgContext | undefined) {
    this.voices.forEach(voice => {
      const stave = voice.getStave();
      if (stave === undefined) {
        return;
      }
      stave.setContext(context);
      stave.draw();

      voice.setContext(context).draw();
    });
    this.beams.forEach(_ => _.setContext(context).draw());
  }

  resetNote(context: RnSvgContext | undefined, measure: number) {
    const voice = this.voices[measure];
    voice.getTickables().forEach(note => {
      this.setColorNote(note, 'black');
    });
    voice.draw(context);
  }

  drawNote(
    context: RnSvgContext | undefined,
    measure: number,
    note: number,
    color: string,
  ) {
    const voice = this.voices[measure];
    const good = voice.getTickables()[note];
    this.setColorNote(good, color);
    voice.draw(context);
  }

  setColorNote(note: Tickable, color: string) {
    note.setStyle({ fillStyle: color, strokeStyle: color });
  }
}

export class VexflowConverter {
  private formatter: Formatter = new Formatter();
  private rhytmicNoteRecognizer: RhytmicNoteRecognizer =
    new RhytmicNoteRecognizer();

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
      line.forEach((measure, i) => {
        const [voice, beams] = this.createMeasure(
          score,
          measure,
          x,
          y,
          staveWidth,
        );
        const stave = voice.getStave();
        if (stave === undefined) {
          throw new Error();
        }
        x += stave.getWidth();
        result.addVoice(voice);
        result.addBeams(beams);
        if (i === line.length - 1) {
          y += stave.getHeight();
        }
      });
    });
    return result;
  }

  createMeasure(
    score: MusicScore,
    measure: Measure,
    x: number,
    y: number,
    staveWidth: number,
  ): [Voice, Beam[]] {
    return this.createLine(score.clef, score.timeSignature, measure.notes, x, y, staveWidth)
  }

  createLine(
    clef: Clef,
    timeSignature: Signature | null,
    notes: Notes[],
    x: number,
    y: number,
    staveWidth: number,
  ): [Voice, Beam[]] {
    const stave = this.createStave(x, y, staveWidth, clef, timeSignature)
    const voice = this.createVoice(
      clef,
      timeSignature,
      notes,
    );
    voice.setStave(stave);

    const beams = this.createBeams(
      notes,
      voice.getTickables() as StaveNote[],
    ).map(_ => new Beam(_));
    this.formatter.formatToStave([voice], stave, { auto_beam: true });
    return [voice, beams];
  }

  createStave(x: number, y: number, width: number, clef: Clef, timeSignature: Signature | null = null): Stave {
    const stave = new Stave(x, y, width);

    if (x !== 0 || y !== 0) {
      return stave;
    }

    stave.setClef(clef);
    if (timeSignature == null) {
      return stave;
    }

    stave.setTimeSignature(toString(timeSignature));
    return stave;
  }

  createVoice(clef: Clef, timeSignature: Signature | null, notes: Notes[]): Voice {
    const notesToDraw = notes.map(note => this.createNote(clef, note));
    const voiceSetting = timeSignature == null ? "" : {
      num_beats: timeSignature.beat,
      beat_value: timeSignature.duration,
      resolution: Flow.RESOLUTION,
    } as VoiceTime;

    const voice = new Voice(voiceSetting);
    if (timeSignature == null) {
      voice.setMode(VoiceMode.SOFT);

    } else {
      voice.setMode(VoiceMode.FULL);
    }

    voice.addTickables([...notesToDraw]);

    return voice;
  }

  createNote(clef: Clef, note: Notes): StaveNote {
    let result = new StaveNote({
      clef: clef,
      keys: [`${note.notehead}/${note.pitch}`],
      duration: this.toBasicRhytm(note.duration).toString(),
    });
    result = this.addDot(note, result);

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

  addDot(note: Notes, result: StaveNote): StaveNote {
    if (
      note.duration === 1 ||
      note.duration === 2 ||
      note.duration === 4 ||
      note.duration === 8 ||
      note.duration === 16 ||
      note.duration === 32
    ) {
      return result;
    }

    Dot.buildAndAttach([result]);
    return result;
  }

  createBeams(notes: Notes[], staveNotes: StaveNote[]): StaveNote[][] {
    const result: StaveNote[][] = [];
    let chunk: StaveNote[] = [];
    const rhtymicNotes = this.rhytmicNoteRecognizer.toRhytmicNote(notes);
    for (let i = 0; i < rhtymicNotes.length; i++) {
      const rhytmic = rhtymicNotes[i];
      for (let j = 0; j < rhytmic.length; j++) {
        const note = notes[rhytmic[j]];
        if (this.canBeBeam(note.duration)) {
          chunk.push(staveNotes[rhytmic[j]]);
        } else {
          this.addInResult(chunk, result);
          chunk = [];
        }
      }
      this.addInResult(chunk, result);
      chunk = [];
    }

    return result;
  }

  private canBeBeam(duration: number) {
    return duration >= 8;
  }

  private addInResult(chunk: StaveNote[], result: StaveNote[][]) {
    if (chunk.length > 1) {
      result.push(chunk);
    }
  }

  toBasicRhytm(duration: number) {
    switch (duration) {
      case 1.5:
        return 1;
      case 3:
        return 2;
      case 6:
        return 4;
      case 12:
        return 8;
      case 24:
        return 16;
    }
    return duration;
  }
}

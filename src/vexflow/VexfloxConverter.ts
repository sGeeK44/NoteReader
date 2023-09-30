import {
  Measure,
  MusicScore,
  Notes,
} from 'app/domain/services/MusicScoreBuilder';
import {toString} from 'app/domain/value-object/Signature';
import {
  Beam,
  Dot,
  Flow,
  Formatter,
  GraceNoteGroup,
  Stave,
  StaveNote,
  StemmableNote,
  Tickable,
  Voice,
  VoiceMode,
} from 'vexflow';
import {RnSvgContext} from './RnSvgContext';

export class VexflowScore {
  private formatter: Formatter = new Formatter();
  constructor(private voices: Voice[] = []) {}

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

      const beams = this.createBeams(voice);
      this.formatter.formatToStave([voice], stave, {auto_beam: true});

      voice.setContext(context).draw();
      beams.forEach(_ => _.setContext(context).draw());

      //Beam.applyAndGetBeams(voice).forEach(_ => _.setContext(context).draw());
    });
  }

  drawGoodNote(
    context: RnSvgContext | undefined,
    measure: number,
    note: number,
  ) {
    this.drawNote(context, measure, note, 'green');
  }

  drawBadNote(
    context: RnSvgContext | undefined,
    measure: number,
    note: number,
  ) {
    this.drawNote(context, measure, note, 'red');
  }

  resetNote(context: RnSvgContext | undefined, measure: number) {
    const voice = this.voices[measure - 1];
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
    const voice = this.voices[measure - 1];
    const good = voice.getTickables()[note - 1];
    this.setColorNote(good, color);
    voice.draw(context);
  }

  setColorNote(note: Tickable, color: string) {
    note.setStyle({fillStyle: color, strokeStyle: color});
  }

  createBeams(voice: Voice): Beam[] {
    return this.bunchBeamNotes(voice.getTickables() as StaveNote[]).map(
      _ => new Beam(_),
    );
  }

  bunchBeamNotes(notes: StaveNote[]): StaveNote[][] {
    const result: StaveNote[][] = [];
    let chunk: StaveNote[] = [];
    for (let i = 0; i < notes.length; i++) {
      const duration = notes[i].getDuration();
      if (!this.canBeBeam(duration)) {
        this.addInResult(chunk, result);
        chunk = [];
      } else {
        chunk.push(notes[i]);
      }
    }

    this.addInResult(chunk, result);
    return result;
  }

  private canBeBeam(duration: string) {
    return parseInt(duration, 10) > 4;
  }

  private addInResult(chunk: StaveNote[], result: StaveNote[][]) {
    if (chunk.length > 1) {
      result.push(chunk);
    }
  }
}

export class VexflowConverter {
  private formatter: Formatter = new Formatter();

  toVexflow(
    score: MusicScore,
    settings: {width: number; measurePerLine: number},
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

  drawGoodNote(score: MusicScore, measure: Measure): void {
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
    const voice = this.createNotes(stave, score, notes);
    voice.setStave(stave);
    return voice;
  }

  createNotes(stave: Stave, score: MusicScore, notes: Notes[]): Voice {
    const notesToDraw = notes.map(note => this.createNote(score, note));

    const voice = new Voice({
      num_beats: score.timeSignature.beat,
      beat_value: score.timeSignature.duration,
      resolution: Flow.RESOLUTION,
    });

    voice.setMode(VoiceMode.FULL);
    voice.addTickables([...notesToDraw]);

    return voice;
  }

  createNote(score: MusicScore, note: Notes): StaveNote {
    let result = new StaveNote({
      clef: score.clef,
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

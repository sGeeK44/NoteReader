import { Measure, MusicScore, Notes } from 'app/domain/services/MusicScoreBuilder';
import { toString } from 'app/domain/value-object/Signature';
import { Flow, Formatter, RenderContext, Stave, StaveNote, Voice } from 'vexflow';

export class VexflowConverter {
  private formatter: Formatter = new Formatter();

  toVexflow(context: RenderContext, score: MusicScore, settings: { width: number, measurePerLine: number }): void {
    const staveWidth = (settings.width) / settings.measurePerLine;
    const staveLines = this.split(score.measures, settings.measurePerLine);
    let y = 0;
    let stave: Stave | undefined;
    staveLines.forEach(line => {
      let x = 0;
      line.forEach(measure => {

        stave = this.drawStave(context, score, measure.notes, x, y, staveWidth)
        x += stave.getWidth();
      })
      if (stave !== undefined) {
        y += stave.getHeight();
      }
    });
  }

  drawNote(context: RenderContext, stave: Stave, score: MusicScore, notes: Notes[]) {
    if (notes.length === 0) {
      return;
    }

    const notesToDraw = notes.map(
      note =>
        new StaveNote({
          clef: score.clef,
          keys: [`${note.notehead}/${note.pitch}`],
          duration: note.duration.toString(),
        }),
    );

    const voice = new Voice({
      num_beats: score.timeSignature.beat,
      beat_value: score.timeSignature.duration,
      resolution: Flow.RESOLUTION,
    });
    voice.addTickables([...notesToDraw]);
    this.formatter.formatToStave([voice], stave, { auto_beam: true });
    voice.draw(context, stave);
  }

  drawStave(context: RenderContext, score: MusicScore, notes: Notes[], x: number, y: number, staveWidth: number): Stave {
    const stave = new Stave(x, y, staveWidth);
    stave.setContext(context);

    if (x === 0 && y === 0) {
      stave.setClef(score.clef);
      stave.setTimeSignature(toString(score.timeSignature))
    }
    stave.draw();
    this.drawNote(context, stave, score, notes);
    return stave;
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

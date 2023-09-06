import { Clef, MusicScore, Notes } from 'app/domain/services/MusicScoreBuilder';
import { BarNote, Flow, Formatter, RenderContext, Stave, StaveNote, Voice } from 'vexflow';

export class VexflowConverter {
  private formatter: Formatter = new Formatter();

  toVexflow(context: RenderContext, score: MusicScore, width: number): void {

    const stave = new Stave(0, 0, width);
    stave.setContext(context);
    stave.setClef(score.clef);
    stave.draw();

    this.drawNote(context, stave, score.clef, score.notes);
  }

  drawNote(context: RenderContext, stave: Stave, clef: Clef, notes: Notes[]) {
    if (notes.length === 0) {
      return;
    }

    const notesToDraw = notes.map(
      note =>
        new StaveNote({
          clef: clef,
          keys: [`${note.notehead}/${note.pitch}`],
          duration: note.duration,
        }),
    );

    const voice = new Voice({
      num_beats: 3,
      beat_value: 4,
      resolution: Flow.RESOLUTION,
    });
    voice.addTickables([...notesToDraw, new BarNote()]);
    this.formatter.formatToStave([voice], stave, { auto_beam: true });
    voice.draw(context, stave);
  }
}

import {Tempo} from 'app/domain/services/Tempo';

describe('Convert tempo to BpMs', () => {
  it('Tempo is 60', () => {
    const tempo = new Tempo(60);

    expect(tempo.toBpMs()).toStrictEqual(1000);
  });

  it('Tempo is 30', () => {
    const tempo = new Tempo(30);

    expect(tempo.toBpMs()).toStrictEqual(2000);
  });

  it('Tempo is 120', () => {
    const tempo = new Tempo(120);

    expect(tempo.toBpMs()).toStrictEqual(500);
  });
});

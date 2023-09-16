import {TimeProvider} from 'app/domain/services/TimeProvider';

export class FakeTimeProvider implements TimeProvider {
  private value = 0;

  now(): number {
    return this.value;
  }
  setNow(value: number) {
    this.value = value;
  }
}

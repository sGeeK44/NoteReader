import { inject } from 'inversify';
import { Symbols } from 'app/config/symbols';
import { TimeProvider } from './TimeProvider';

export class TimeChecker {
  private startAt = 0;
  private accuracy = 400;

  constructor(
    @inject(Symbols.TimeProvider) private timeProvider: TimeProvider,
  ) { }

  start() {
    this.startAt = this.timeProvider.now();
  }

  reset() {
    this.startAt = this.timeProvider.now();
  }

  elapse(): number {
    return this.timeProvider.now() - this.startAt;
  }

  isOnTime(expectedTime: number): "ON_TIME" | "TO_EARLY" | "TO_LATE" {
    const elapse = this.elapse();
    if (elapse < expectedTime - this.accuracy) {
      return "TO_EARLY";
    }
    if (elapse > expectedTime + this.accuracy) {
      return "TO_LATE";
    }
    return "ON_TIME";
  }
}
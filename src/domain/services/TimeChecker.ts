import { inject } from 'inversify';
import { Symbols } from "app/config/symbols";
import { TimeProvider } from "./TimeProvider";

export class TimeChecker {
    private startAt: number = 0;
    private accuracy: number = 200;

    constructor(@inject(Symbols.TimeProvider) private timeProvider: TimeProvider) { }

    start() {
        this.startAt = this.timeProvider.now();
    }

    isOnTime(expectedTime: number) {
        const elapse = this.timeProvider.now() - this.startAt;
        return elapse >= expectedTime - this.accuracy && elapse <= expectedTime + this.accuracy;
    }
}
import { inject } from 'inversify';
import { Symbols } from "app/config/symbols";
import { TimeProvider } from "./TimeProvider";

export class TimeChecker {
    private startAt: number = 0;
    private accuracy: number = 400;

    constructor(@inject(Symbols.TimeProvider) private timeProvider: TimeProvider) { }

    start() {
        this.startAt = this.timeProvider.now();
    }

    reset() {
        this.startAt = this.timeProvider.now();
    }

    elapse(): number {
        return this.timeProvider.now() - this.startAt;
    }

    isOnTime(expectedTime: number) {
        const elapse = this.elapse();
        if (elapse < expectedTime - this.accuracy) {
            console.log("To early !");
            return false;
        }
        if (elapse > expectedTime + this.accuracy) {
            console.log("To late !");
            return false;
        }
        return true;
    }
}

export class Tempo {
    constructor(public value: number) {
        this.value = value;
    }

    toBpMs(): number {
        return 60 / this.value * 1000;
    }
}

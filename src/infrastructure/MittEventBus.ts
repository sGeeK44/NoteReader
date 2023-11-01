import {injectable} from 'inversify';
import {Handler} from 'app/domain/core/Handler';
import {Events} from 'app/domain/core/Events';
import mitt from 'mitt';

@injectable()
export class MittEventBus {
  private emitter = mitt<Events>();

  subscribe<Key extends keyof Events>(
    type: Key,
    handler: Handler<Events[Key]>,
  ) {
    this.emitter.on(type, handler);
  }

  publish<Key extends keyof Events>(type: Key, event: Events[Key]): void {
    this.emitter.emit(type, event);
  }
}

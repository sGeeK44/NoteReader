import {Events} from './Events';
import {Handler} from './Handler';

export interface EventBus {
  subscribe<Key extends keyof Events>(
    type: Key,
    handler: Handler<Events[Key]>,
  ): void;
  publish<Key extends keyof Events>(type: Key, event: Events[Key]): void;
}

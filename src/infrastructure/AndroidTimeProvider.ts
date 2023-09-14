import { TimeProvider } from 'app/domain/services/TimeProvider';
import { injectable } from 'inversify';

@injectable()
export class AndroidTimeProvider implements TimeProvider {
  now(): number {
    return Date.now()
  }
}

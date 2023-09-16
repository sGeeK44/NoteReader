import {describe, it, expect} from '@jest/globals';
import {FakeTimeProvider} from '../../fakes/FakeTimeProvider';
import {TimeChecker} from 'app/domain/services/TimeChecker';

describe('TimeChecker', () => {
  it('respond widely before', () => {
    const timeProvider = new FakeTimeProvider();
    const timechecker = new TimeChecker(timeProvider);

    timechecker.start();

    const result = timechecker.isOnTime(1000);

    expect(result).toBeFalsy();
  });

  it('respond widely after', () => {
    const timeProvider = new FakeTimeProvider();
    const timechecker = new TimeChecker(timeProvider);

    timechecker.start();

    timeProvider.setNow(2000);

    const result = timechecker.isOnTime(1000);

    expect(result).toBeFalsy();
  });

  it('respond excactly on time', () => {
    const timeProvider = new FakeTimeProvider();
    const timechecker = new TimeChecker(timeProvider);

    timechecker.start();

    timeProvider.setNow(1000);

    const result = timechecker.isOnTime(1000);

    expect(result).toBeTruthy();
  });

  it('respond just before on time with default accuracy', () => {
    const timeProvider = new FakeTimeProvider();
    const timechecker = new TimeChecker(timeProvider);

    timechecker.start();

    timeProvider.setNow(800);

    const result = timechecker.isOnTime(1000);

    expect(result).toBeTruthy();
  });

  it('respond just before on time with default accuracy', () => {
    const timeProvider = new FakeTimeProvider();
    const timechecker = new TimeChecker(timeProvider);

    timechecker.start();

    timeProvider.setNow(1200);

    const result = timechecker.isOnTime(1000);

    expect(result).toBeTruthy();
  });
});

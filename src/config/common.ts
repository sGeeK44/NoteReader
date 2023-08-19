import {Container} from 'inversify';

export async function buildDependencies(): Promise<Container> {
  return Promise.resolve(new Container());
}

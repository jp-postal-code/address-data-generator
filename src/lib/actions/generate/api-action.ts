import { Action } from '../action';

interface Options {
  pretty: boolean;
}

export const defaultOptions = {
  pretty: false,
};

export const apiAction: Action<[string], Options> = async () => {
  throw new Error('not implemented.');
};

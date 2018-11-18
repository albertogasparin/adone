/* eslint-env jest */

import { storeMock } from './mocks';
import applyMiddleware from '../middlewares';
import defaults from '../defaults';

jest.mock('../defaults');

describe('applyMiddleware', () => {
  it('should always build update middleware', () => {
    defaults.mutator = jest.fn();
    const mutation = {};
    const combinedMw = applyMiddleware(storeMock, []);
    combinedMw(mutation);
    expect(defaults.mutator).toHaveBeenCalled();
  });

  it('should build combined middlewares', () => {
    const mutation = {};
    const middlewareSpy = jest.fn();
    const middleware = store => next => fn => {
      const result = next(fn);
      middlewareSpy(store, next, fn, result);
      return result;
    };

    const combinedMw = applyMiddleware(storeMock, [middleware]);
    combinedMw(mutation);
    expect(middlewareSpy).toHaveBeenCalledWith(
      storeMock,
      expect.any(Function),
      mutation,
      undefined
    );
  });
});

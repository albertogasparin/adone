/* eslint-env jest */

import { basketMock, storeMock } from './mocks';
import { bindActions } from '../bind-actions';
import combineMiddlewares from '../middlewares';

jest.mock('../middlewares');

describe('bindActions', () => {
  it('should return all actions bound', () => {
    const result = bindActions(basketMock.actions, storeMock);
    expect(result).toEqual({
      increase: expect.any(Function),
      decrease: expect.any(Function),
    });
  });

  it('should bound actions providing mutator, getState and container props', () => {
    const actionInner = jest.fn();
    const mutator = jest.fn();
    basketMock.actions.increase.mockReturnValue(actionInner);
    combineMiddlewares.mockReturnValue(mutator);
    const result = bindActions(basketMock.actions, storeMock, () => ({
      url: '',
    }));
    result.increase(1);
    expect(basketMock.actions.increase).toHaveBeenCalledWith(1);
    expect(actionInner).toHaveBeenCalledWith(
      {
        setState: expect.any(Function),
        getState: storeMock.getState,
        actions: expect.objectContaining({
          increase: expect.any(Function),
          decrease: expect.any(Function),
        }),
      },
      { url: '' }
    );
  });
});

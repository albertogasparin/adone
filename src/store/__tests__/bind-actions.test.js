/* eslint-env jest */

import { actionsMock, storeStateMock } from '../../__tests__/mocks';
import { bindActions } from '../bind-actions';
import combineMiddlewares from '../../middlewares';

jest.mock('../../middlewares');

describe('bindActions', () => {
  it('should return all actions bound', () => {
    const result = bindActions(actionsMock, storeStateMock);
    expect(result).toEqual({
      increase: expect.any(Function),
      decrease: expect.any(Function),
    });
  });

  it('should bound actions providing mutator, getState and container props', () => {
    const actionInner = jest.fn();
    const mutator = jest.fn();
    actionsMock.increase.mockReturnValue(actionInner);
    combineMiddlewares.mockReturnValue(mutator);
    const result = bindActions(actionsMock, storeStateMock, () => ({
      url: '',
    }));
    result.increase(1);
    expect(actionsMock.increase).toHaveBeenCalledWith(1);
    expect(actionInner).toHaveBeenCalledWith(
      {
        setState: expect.any(Function),
        getState: storeStateMock.getState,
        actions: expect.objectContaining({
          increase: expect.any(Function),
          decrease: expect.any(Function),
        }),
        dispatch: expect.any(Function),
      },
      { url: '' }
    );
  });
});

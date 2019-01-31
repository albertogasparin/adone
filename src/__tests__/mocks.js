/* eslint-env jest */

export const basketMock = {
  key: ['basket-key'],
  initialState: { count: 0 },
  actions: {
    increase: jest.fn(),
    decrease: jest.fn(),
  },
};

export const storeMock = {
  key: basketMock.key,
  getState: jest.fn(),
  setState: jest.fn(),
  subscribe: jest.fn(),
  listeners: jest.fn(),
  mutator: jest.fn(),
};

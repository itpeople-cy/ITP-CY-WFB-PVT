const RequestHandler = require('./RequestHandler');

test('successHandler returns response after toasting', () => {
  expect(
    RequestHandler.successHandler({
      status: 200,
    }),
  ).toEqual({ status: 200 });
});

test('errorHandler throws error response data after toasting', () => {
  expect(
    () => {
      RequestHandler.errorHandler({
        response: { status: 400, data: 'quaffle' },
      });
    },
  ).toThrow('quaffle');
});

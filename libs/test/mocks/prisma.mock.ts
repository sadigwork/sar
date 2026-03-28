export const prismaMock = {
  application: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  applicationReview: {
    create: jest.fn(),
    count: jest.fn(),
  },
  workflow: {
    findFirst: jest.fn(),
  },
  notification: {
    create: jest.fn(),
  },
  $transaction: jest.fn((cb) => cb(prismaMock)),
};

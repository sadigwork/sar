import type { Config } from 'jest';
import { getJestProjectsAsync } from '@nx/jest';

// export default async (): Promise<Config> => ({
//   projects: await getJestProjectsAsync(),
// });

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
};

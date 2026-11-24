// Configuración de Jest para Next.js.
// next/jest transforma JSX e import/export con SWC y lee la configuración del proyecto.
const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const config = {
  // jsdom simula un navegador: lo necesitan las pruebas de componentes.
  // Las pruebas unitarias también corren bien en este entorno.
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: ['<rootDir>/tests/**/*.test.{js,jsx}'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: ['src/lib/**/*.js', 'src/components/**/*.jsx'],
};

module.exports = createJestConfig(config);

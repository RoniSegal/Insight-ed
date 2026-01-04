import '@testing-library/jest-dom';

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    href: '',
    pathname: '/',
    search: '',
    hash: '',
    origin: 'http://localhost:4001',
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
  },
  writable: true,
});

// Mock localStorage with actual storage
const storage = new Map<string, string>();
const localStorageMock = {
  getItem: jest.fn((key: string) => storage.get(key) || null),
  setItem: jest.fn((key: string, value: string) => storage.set(key, value)),
  removeItem: jest.fn((key: string) => storage.delete(key)),
  clear: jest.fn(() => storage.clear()),
  get length() {
    return storage.size;
  },
  key: jest.fn((index: number) => {
    const keys = Array.from(storage.keys());
    return keys[index] || null;
  }),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock fetch
global.fetch = jest.fn();

// Mock scrollIntoView (not implemented in jsdom)
Element.prototype.scrollIntoView = jest.fn();

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
  storage.clear();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
});

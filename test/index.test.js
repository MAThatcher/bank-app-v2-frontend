import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../src/App';
jest.mock('axios');

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn().mockReturnValue({
    render: jest.fn(),
  }),
}));

test('renders App component using ReactDOM.createRoot', () => {
  const rootMock = document.createElement('div');
  rootMock.id = 'root';
  document.body.appendChild(rootMock);

  require('./index'); // Importing index.js to trigger its execution

  expect(ReactDOM.createRoot).toHaveBeenCalledWith(rootMock);
  expect(ReactDOM.createRoot(rootMock).render).toHaveBeenCalledWith(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});

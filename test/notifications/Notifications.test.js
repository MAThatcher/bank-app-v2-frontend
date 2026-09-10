import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../src/contexts/AuthProvider';
import NotificationsProvider from '../../src/contexts/NotificationsProvider';
import NotificationsPage from '../../src/pages/NotificationsPage';
import Header from '../../src/components/layout/Header';
import * as api from '../../src/api/notificationsApi';
jest.mock('../../src/api/notificationsApi', () => ({
  getNotificationsApi: jest.fn(), getUnreadCountApi: jest.fn(), dismissNotificationApi: jest.fn(), dismissAllNotificationsApi: jest.fn(),
}));
const note = { id: 31, type: 'transfer', message: 'Transfer complete: 10.75 ₮.', dismissed: false, create_date: '2026-09-09T12:00:00Z' };
function App({ user = { id: 7 }, page = true }) {
  return <MemoryRouter><AuthContext.Provider value={{ user, logout: jest.fn() }}><NotificationsProvider><Header />{page && <NotificationsPage />}</NotificationsProvider></AuthContext.Provider></MemoryRouter>;
}
beforeEach(() => {
  jest.resetAllMocks();
  api.getNotificationsApi.mockResolvedValue({ data: [note] });
  api.getUnreadCountApi.mockResolvedValue({ data: { count: 1 } });
  api.dismissNotificationApi.mockResolvedValue({ data: [{ id: 31, dismissed: true }] });
  api.dismissAllNotificationsApi.mockResolvedValue({ data: { dismissed: 1 } });
});
test('shows the dispatch and accessible unread badge', async () => {
  render(<App />);
  expect(await screen.findByText(note.message)).toBeInTheDocument();
  expect(await screen.findByRole('link', { name: 'Notifications, 1 unread' })).toHaveAttribute('href', '/notifications');
  expect(screen.getByText('Transfer confirmed')).toBeInTheDocument();
});
test('empty inbox is a normal state', async () => {
  api.getNotificationsApi.mockResolvedValue({ data: [] });
  api.getUnreadCountApi.mockResolvedValue({ data: { count: 0 } });
  render(<App />);
  expect(await screen.findByText('No transmissions found.')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Dismiss all unread' })).toBeDisabled();
});
test('unread and type filters are sent together', async () => {
  const user = userEvent.setup(); render(<App />);
  await screen.findByText(note.message);
  await user.click(screen.getByRole('button', { name: 'Unread', exact: true }));
  await waitFor(() => expect(screen.getByLabelText('Dispatch type')).toBeEnabled());
  await user.selectOptions(screen.getByLabelText('Dispatch type'), 'membership');
  await waitFor(() => expect(api.getNotificationsApi).toHaveBeenLastCalledWith({ limit: 30, unread: 'true', type: 'membership' }));
});
test('dismissing a dispatch refreshes the list and the badge', async () => {
  const user = userEvent.setup(); render(<App />); await screen.findByText(note.message);
  api.getNotificationsApi.mockResolvedValue({ data: [{ ...note, dismissed: true }] });
  api.getUnreadCountApi.mockResolvedValue({ data: { count: 0 } });
  await user.click(screen.getByRole('button', { name: 'Dismiss transmission 31' }));
  expect(await screen.findByText('Transmission dismissed.')).toBeInTheDocument();
  expect(api.dismissNotificationApi).toHaveBeenCalledWith(31);
  await screen.findByRole('link', { name: 'Notifications, 0 unread' });
  expect(screen.queryByRole('button', { name: 'Dismiss transmission 31' })).not.toBeInTheDocument();
  expect(screen.getByText(note.message)).toBeInTheDocument();
});
test('failed dismissal leaves the dispatch available for retry', async () => {
  api.dismissNotificationApi.mockRejectedValue(new Error('offline'));
  const user = userEvent.setup(); render(<App />); await screen.findByText(note.message);
  await user.click(screen.getByRole('button', { name: 'Dismiss transmission 31' }));
  await screen.findByRole('alert');
  expect(screen.getByRole('button', { name: 'Dismiss transmission 31' })).toBeEnabled();
  expect(screen.queryByText('Transmission dismissed.')).not.toBeInTheDocument();
});
test('dismiss all refreshes the inbox and reports completion', async () => {
  const user = userEvent.setup(); render(<App />); await screen.findByText(note.message);
  api.getNotificationsApi.mockResolvedValue({ data: [{ ...note, dismissed: true }] });
  await user.click(screen.getByRole('button', { name: 'Dismiss all unread' }));
  await screen.findByText('All unread transmissions dismissed.');
  expect(api.dismissAllNotificationsApi).toHaveBeenCalledTimes(1);
});
test('loading errors offer an operational refresh action', async () => {
  api.getNotificationsApi.mockRejectedValueOnce(new Error('offline')).mockResolvedValue({ data: [note] });
  const user = userEvent.setup(); render(<App />); await screen.findByRole('alert');
  await user.click(screen.getByRole('button', { name: 'Refresh' }));
  expect(await screen.findByText(note.message)).toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
test('older pages use a cursor and retain previously loaded messages', async () => {
  const page = Array.from({ length: 30 }, (_, i) => ({ ...note, id: 60 - i, message: 'Dispatch ' + (60 - i) }));
  api.getNotificationsApi.mockResolvedValueOnce({ data: page }).mockResolvedValue({ data: [{ ...note, id: 30, message: 'Older dispatch' }] });
  const user = userEvent.setup(); render(<App />); await screen.findByText('Dispatch 60');
  await user.click(screen.getByRole('button', { name: 'Load older transmissions' }));
  await screen.findByText('Older dispatch');
  expect(screen.getByText('Dispatch 60')).toBeInTheDocument();
  expect(api.getNotificationsApi).toHaveBeenLastCalledWith({ limit: 30, before: 31 });
});
test('late badge response cannot leak across a sign-out', async () => {
  let resolve;
  api.getUnreadCountApi.mockImplementation(() => new Promise(done => { resolve = done; }));
  const view = render(<App page={false} />);
  view.rerender(<App user={null} page={false} />);
  resolve({ data: { count: 99 } });
  await waitFor(() => expect(screen.queryByRole('link', { name: /Notifications/ })).not.toBeInTheDocument());
});
test('a completed transfer event refreshes the badge immediately', async () => {
  render(<App page={false} />); await screen.findByRole('link', { name: 'Notifications, 1 unread' });
  api.getUnreadCountApi.mockResolvedValue({ data: { count: 2 } });
  fireEvent(window, new Event('notifications-changed'));
  await screen.findByRole('link', { name: 'Notifications, 2 unread' });
});

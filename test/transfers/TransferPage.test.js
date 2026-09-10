
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../src/contexts/AuthProvider';
import TransferPage from '../../src/pages/account/TransferPage';
import { getTransferAccountsApi, createTransferApi } from '../../src/api/transactionsApi';
import { prepareTransfer, toCents, decimalCents } from '../../src/utils/transfers';

jest.mock('../../src/api/transactionsApi', () => ({
  getTransferAccountsApi: jest.fn(), createTransferApi: jest.fn(),
}));

const accounts = [
  { id: 1, name: 'Golden Reserve', balance: '100.25', overdraft: false },
  { id: 2, name: 'Tithe Vault', balance: '25.10', overdraft: false },
];
const result = { data: { transfer: {
  id: '00000000-0000-4000-8000-000000000001', sourceAccountId: 1, destinationAccountId: 2, amount: '10.75',
  sourceBalanceBefore: '100.25', sourceBalanceAfter: '89.50', destinationBalanceBefore: '25.10',
  destinationBalanceAfter: '35.85', createdAt: '2026-09-09T12:00:00Z', description: '',
} } };
const display = () => render(<MemoryRouter><AuthContext.Provider value={{ user: { id: 7 } }}><TransferPage /></AuthContext.Provider></MemoryRouter>);
beforeEach(() => {
  jest.resetAllMocks();
  sessionStorage.clear();
  getTransferAccountsApi.mockResolvedValue({ data: accounts });
  createTransferApi.mockResolvedValue(result);
});

async function prepare(user) {
  await user.selectOptions(await screen.findByLabelText('Source vault'), '1');
  await user.selectOptions(screen.getByLabelText('Destination vault'), '2');
  await user.type(screen.getByLabelText('Amount (₮)'), '10.75');
  await user.click(screen.getByRole('button', { name: /Review requisition/ }));
  await screen.findByRole('heading', { name: 'Review your requisition.' });
}

test('review uses exact cents and no transfer is sent before authorization', async () => {
  const user = userEvent.setup();
  display();
  await prepare(user);
  expect(screen.getByText('89.50 ₮')).toBeInTheDocument();
  expect(screen.getByText('35.85 ₮')).toBeInTheDocument();
  expect(createTransferApi).not.toHaveBeenCalled();
  await user.click(screen.getByRole('button', { name: /Authorize transfer/ }));
  await screen.findByRole('heading', { name: 'The ledger is balanced.' });
  expect(createTransferApi).toHaveBeenCalledTimes(1);
  expect(createTransferApi.mock.calls[0][0]).toMatchObject({
    sourceAccountId: 1, destinationAccountId: 2, amount: '10.75',
    expectedSourceBalance: '100.25', expectedDestinationBalance: '25.10',
  });
  expect(screen.getByRole('link', { name: /View source ledger/ })).toHaveAttribute('href', '/account/1');
  expect(sessionStorage.getItem('imperial-transfer-7')).toBeNull();
});

test('an interrupted confirmation retries exactly the same request and key', async () => {
  createTransferApi.mockRejectedValueOnce(new Error('connection lost')).mockResolvedValueOnce(result);
  const user = userEvent.setup();
  display(); await prepare(user);
  await user.click(screen.getByRole('button', { name: /Authorize transfer/ }));
  await user.click(await screen.findByRole('button', { name: /Check transfer result/ }));
  await screen.findByRole('heading', { name: 'The ledger is balanced.' });
  expect(createTransferApi).toHaveBeenCalledTimes(2);
  expect(createTransferApi.mock.calls[1][0]).toEqual(createTransferApi.mock.calls[0][0]);
});

test('a page reload retains a possibly completed request instead of generating a new one', async () => {
  createTransferApi.mockRejectedValueOnce(new Error('connection lost')).mockResolvedValueOnce(result);
  const user = userEvent.setup();
  const first = display(); await prepare(user);
  await user.click(screen.getByRole('button', { name: /Authorize transfer/ }));
  await screen.findByRole('button', { name: /Check transfer result/ });
  const payload = createTransferApi.mock.calls[0][0];
  first.unmount();
  display();
  await user.click(await screen.findByRole('button', { name: /Check transfer result/ }));
  await screen.findByRole('heading', { name: 'The ledger is balanced.' });
  expect(createTransferApi.mock.calls[1][0]).toEqual(payload);
});

test('server balance changes require another explicit review', async () => {
  createTransferApi.mockRejectedValueOnce({ response: { status: 409, data: { code: 'BALANCE_CHANGED', error: 'A vault balance changed.' } } });
  const user = userEvent.setup();
  display(); await prepare(user);
  await user.click(screen.getByRole('button', { name: /Authorize transfer/ }));
  await screen.findByText('A vault balance changed.');
  expect(await screen.findByLabelText('Source vault')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Authorize transfer/ })).not.toBeInTheDocument();
  expect(sessionStorage.getItem('imperial-transfer-7')).toBeNull();
  expect(createTransferApi).toHaveBeenCalledTimes(1);
});

test('balances are fetched again when preparing the review', async () => {
  getTransferAccountsApi.mockResolvedValueOnce({ data: accounts }).mockResolvedValue({ data: [{ ...accounts[0], balance: '90.25' }, accounts[1]] });
  const user = userEvent.setup();
  display(); await prepare(user);
  expect(screen.getByText('79.50 ₮')).toBeInTheDocument();
  expect(getTransferAccountsApi).toHaveBeenCalledTimes(2);
});

test('no money-moving request is sent if the pending request cannot be persisted', async () => {
  const user = userEvent.setup();
  display(); await prepare(user);
  const storage = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
  try {
    await user.click(screen.getByRole('button', { name: /Authorize transfer/ }));
    await screen.findByText(/Browser storage is unavailable/);
    expect(createTransferApi).not.toHaveBeenCalled();
  } finally { storage.mockRestore(); }
});

test('fewer than two accessible vaults shows the establish-vault path', async () => {
  getTransferAccountsApi.mockResolvedValue({ data: [accounts[0]] });
  display();
  await screen.findByRole('heading', { name: 'Two vaults are required.' });
  expect(screen.getByRole('link', { name: /Establish a vault/ })).toHaveAttribute('href', '/account/create');
});

test('cent arithmetic does not accumulate floating-point errors', () => {
  expect(toCents('0.10') + toCents('0.20')).toBe(30);
  expect(decimalCents(30)).toBe('0.30');
  expect(toCents('99999999999.99')).toBe(9999999999999);
});

test.each(['1.001', 'NaN', 'Infinity', '', '100000000000.00'])('invalid money %s is rejected', value => {
  expect(() => toCents(value)).toThrow();
});

test('same-vault and insufficient-funds requests cannot reach review', () => {
  const form = { sourceAccountId: '1', destinationAccountId: '1', amount: '1', description: '' };
  expect(() => prepareTransfer(accounts, form, 'key')).toThrow('different vaults');
  expect(() => prepareTransfer(accounts, { ...form, destinationAccountId: '2', amount: '100.26' }, 'key')).toThrow('insufficient funds');
});


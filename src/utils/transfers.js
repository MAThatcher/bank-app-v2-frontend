
const LIMIT = 9999999999999;

// Integer cents keep the review screen consistent with database Decimal arithmetic.
export function toCents(value) {
  const match = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(String(value));
  if (!match) throw new Error('Use an amount with at most two decimal places.');
  const cents = Number(match[2]) * 100 + Number((match[3] || '').padEnd(2, '0'));
  if (!Number.isSafeInteger(cents) || cents > LIMIT) throw new Error('The amount exceeds the supported range.');
  return match[1] ? -cents : cents;
}

export function decimalCents(cents) {
  const absolute = Math.abs(cents);
  return (cents < 0 ? '-' : '') + Math.floor(absolute / 100) + '.' + String(absolute % 100).padStart(2, '0');
}

export function displayCents(cents) {
  const absolute = Math.abs(cents);
  return (cents < 0 ? '−' : '') + Math.floor(absolute / 100).toLocaleString('en-US') + '.' + String(absolute % 100).padStart(2, '0');
}

export function prepareTransfer(accounts, form, key) {
  const source = accounts.find(account => String(account.id) === form.sourceAccountId);
  const destination = accounts.find(account => String(account.id) === form.destinationAccountId);
  if (!source || !destination) throw new Error('Select two accessible vaults.');
  if (source.id === destination.id) throw new Error('Select two different vaults.');
  const amount = toCents(form.amount);
  if (amount <= 0) throw new Error('Enter an amount greater than zero.');
  const sourceBefore = toCents(source.balance);
  const destinationBefore = toCents(destination.balance);
  const sourceAfter = sourceBefore - amount;
  const destinationAfter = destinationBefore + amount;
  if (!source.overdraft && sourceAfter < 0) throw new Error('The source vault has insufficient funds. Overdraft is not permitted.');
  if (Math.abs(sourceAfter) > LIMIT || Math.abs(destinationAfter) > LIMIT) throw new Error('This transfer would exceed a vault balance limit.');
  return {
    sourceName: source.name || 'Vault #' + source.id,
    destinationName: destination.name || 'Vault #' + destination.id,
    sourceAfter, destinationAfter, submitted: false,
    payload: {
      sourceAccountId: source.id, destinationAccountId: destination.id,
      amount: decimalCents(amount), description: form.description.trim(),
      expectedSourceBalance: decimalCents(sourceBefore),
      expectedDestinationBalance: decimalCents(destinationBefore),
      idempotencyKey: key,
    },
  };
}

export function transferKey() {
  if (window.crypto.randomUUID) return window.crypto.randomUUID();
  const bytes = window.crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-');
}


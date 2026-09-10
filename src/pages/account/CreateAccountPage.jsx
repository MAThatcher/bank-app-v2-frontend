import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createAccountApi } from '../../api/accountsApi';
import { Aquila, PageHeading, Notice } from '../../components/common/Imperial';
export default function CreateAccountPage() {
  const [name, setName] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  const navigate = useNavigate();
  const submit = async e => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Enter a vault designation.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const {
        data
      } = await createAccountApi({
        accountName: name.trim()
      });
      navigate(data.accountId ? '/account/' + data.accountId : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'The vault could not be established. Please try again.');
    } finally {
      setBusy(false);
    }
  };
  return <div className="workspace"><Link className="back-link" to="/dashboard">← Vault command</Link><PageHeading eyebrow="NEW ASSET REGISTRATION" title="Establish a vault.">A new chapter in your Imperial ledger.</PageHeading><div className="create-vault-layout"><section className="form-panel"><p className="eyebrow">VAULT DESIGNATION</p><h2>Name your holding</h2><p className="muted">Choose a designation you will recognize in your vault register.</p><form onSubmit={submit}><label>Vault name<input autoFocus required maxLength={100} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. The Golden Reserve" /></label><p className="fine-print">Your new vault opens with a zero balance. Record a deposit from its ledger to add holdings.</p>{error && <Notice error>{error}</Notice>}<div className="button-row"><button className="btn btn-primary" disabled={busy}>{busy ? 'Establishing…' : 'Establish vault'} →</button><Link className="text-link" to="/dashboard">Cancel</Link></div></form></section><aside className="vault-preview"><p className="eyebrow">IMPERIAL ASSET REGISTRY</p><Aquila /><h2>{name.trim() || 'Your Imperial vault'}</h2><p>0.00 <span>₮</span></p><span className="eyebrow">AWAITING REGISTRATION</span></aside></div></div>;
}

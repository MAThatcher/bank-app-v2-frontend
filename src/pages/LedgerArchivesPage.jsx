import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { searchLedgerApi, exportLedgerApi, getTransferAccountsApi } from '../api/transactionsApi';
import { PageHeading, Notice, Loading, Empty } from '../components/common/Imperial';
import {getLedgerLabelsApi} from '../api/ledgerLabelsApi';
import LedgerLabelActions from '../components/common/LedgerLabelActions';
const fields = ['q','accountId','from','to','minAmount','maxAmount','category','type','categoryId','tagId'];
const blank = Object.fromEntries(fields.map(key => [key,'']));
export const exactMoney = value => {
  const [whole, fraction = ''] = String(value ?? '0').split('.');
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + fraction.padEnd(2,'0');
};
const kind = row => row.transferId ? (String(row.amount).startsWith('-') ? 'Transfer out' : 'Transfer in') : (String(row.amount).startsWith('-') ? 'Withdrawal' : 'Deposit');
const compact = values => Object.fromEntries(Object.entries(values).filter(([,value]) => value !== ''));
export default function LedgerArchivesPage() {
  const [params,setParams] = useSearchParams();
  const queryString = params.toString();
  const filters = useMemo(() => { const query = new URLSearchParams(queryString); return Object.fromEntries(fields.map(key => [key,query.get(key) || ''])); },[queryString]);
  const [draft,setDraft] = useState(filters), [report,setReport] = useState(null), [accounts,setAccounts] = useState([]);
  const [loading,setLoading] = useState(true), [error,setError] = useState(''), [vaultError,setVaultError] = useState('');
  const [exporting,setExporting] = useState(false), [exportStatus,setExportStatus] = useState('');
  const [catalog,setCatalog]=useState(null),[labelError,setLabelError]=useState(''),[selected,setSelected]=useState([]),[labelsBusy,setLabelsBusy]=useState(false);
  const sequence = useRef(0), exportFlight = useRef(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(filters);
  const load = useCallback(async before => {
    const request = ++sequence.current;
    setLoading(true); setError('');
    try {
      const { data } = await searchLedgerApi({ ...compact(filters), ...(before ? {before} : {}) });
      if (request !== sequence.current) return;
      setReport(old => before && old ? { ...data, entries:[...old.entries,...data.entries.filter(row => !old.entries.some(existing => existing.id === row.id))] } : data);
    } catch(err) { if(request === sequence.current) setError(err.response?.data?.error || 'Unable to retrieve the ledger archives. Please retry.'); }
    finally { if(request === sequence.current) setLoading(false); }
  },[filters]);
  useEffect(() => {
    const tracker = sequence; setDraft(filters); setReport(null); setSelected([]); setExportStatus(''); load();
    return () => { ++tracker.current; };
  },[filters,load]);
  useEffect(() => {
    let active = true;
    getLedgerLabelsApi().then(data=>{if(active)setCatalog(data);}).catch(()=>{if(active)setLabelError('Custom labels are unavailable. Reload the page to retry.');});
    getTransferAccountsApi().then(({data}) => { if(active) setAccounts(data); }).catch(() => { if(active) setVaultError('The vault selector is unavailable. You can still search across all accessible vaults.'); });
    return () => { active = false; };
  },[]);
  const edit = event => setDraft(old => ({ ...old,[event.target.name]:event.target.value }));
  async function download() {
    if(exportFlight.current) return;
    exportFlight.current = true; setExporting(true); setError(''); setExportStatus('');
    const request = sequence.current;
    try {
      const {data} = await exportLedgerApi(compact(filters));
      if (request !== sequence.current) return;
      const url = URL.createObjectURL(new Blob([data],{type:'text/csv;charset=utf-8'}));
      const link = document.createElement('a'); link.href=url; link.download='ledger-archives.csv'; document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url),1000);
      setExportStatus('CSV download prepared for all matching entries.');
    } catch(err) {
      let message = 'The export could not be prepared. Please retry.';
      try { const response = err.response?.data; const data = response?.text ? JSON.parse(await response.text()) : response; if(data?.error) message=data.error; } catch { /* Keep the fallback message. */ }
      setError(message);
    } finally { exportFlight.current=false; setExporting(false); }
  }
  return <div className="workspace archives-workspace">
    <Link className="btn btn-outline" to="/labels">Manage categories & tags</Link>
    <PageHeading eyebrow="ADMINISTRATUM / LEDGER ARCHIVES" title="Every entry. Accounted for." action={<button className="btn btn-outline" disabled={loading || exporting || dirty || !report?.totals.count} onClick={download}>{exporting ? 'Preparing export…' : 'Export matching CSV ↓'}</button>}>Search your accessible vaults and inspect the movement of throne gelt.</PageHeading>
    <form className="archives-filters form-panel" onSubmit={event => {event.preventDefault(); const next=compact(draft); if(JSON.stringify(draft)===JSON.stringify(filters)) load(); else setParams(next);}}><fieldset className="security-fieldset" disabled={labelsBusy}>
      <div className="archives-search"><label>Search ledger<input name="q" value={draft.q} onChange={edit} maxLength={200} placeholder="Description, category, vault name or transfer reference" /></label><label>Vault<select name="accountId" value={draft.accountId} onChange={edit}><option value="">All accessible vaults</option>{accounts.map(account => <option key={account.id} value={account.id}>{account.name || `Vault #${account.id}`}</option>)}</select></label></div>
      <div className="archives-filter-grid"><label>From date (UTC)<input type="date" name="from" value={draft.from} onChange={edit} /></label><label>Through date (UTC)<input type="date" name="to" value={draft.to} onChange={edit} /></label><label>Minimum amount<input type="number" min="0" step="0.01" name="minAmount" value={draft.minAmount} onChange={edit} placeholder="0.00" /></label><label>Maximum amount<input type="number" min="0" step="0.01" name="maxAmount" value={draft.maxAmount} onChange={edit} placeholder="No maximum" /></label><label>Category<input name="category" maxLength={1020} value={draft.category} onChange={edit} list="ledger-categories" placeholder="Exact category" /><datalist id="ledger-categories">{report?.categories.map(row => <option key={row.category} value={row.category} />)}</datalist></label><label>Transaction type<select name="type" value={draft.type} onChange={edit}><option value="">All types</option><option value="deposit">Deposits</option><option value="withdrawal">Withdrawals</option><option value="transfer">Transfers</option></select></label></div>
      <div className="button-row"><button className="btn btn-primary" disabled={loading || exporting}>Apply filters</button><button type="button" className="btn btn-quiet" disabled={exporting} onClick={() => {setDraft(blank); if(queryString) setParams({}); else load();}}>Reset filters</button><span className="fine-print">Amounts filter by magnitude. Dates include the entire selected day in UTC.</span></div>
      <div className="form-grid"><label>Custom category<select name="categoryId" value={draft.categoryId} onChange={edit}><option value="">All categories</option>{catalog?.categories.map(row=><option key={row.id} value={row.id}>{row.name}{row.archived?' (archived)':''}</option>)}</select></label><label>Tag filter<select name="tagId" value={draft.tagId} onChange={edit}><option value="">All tags</option>{catalog?.tags.map(row=><option key={row.id} value={row.id}>{row.name}{row.archived?' (archived)':''}</option>)}</select></label></div>
    </fieldset></form>{labelError&&<Notice error>{labelError}</Notice>}
    {dirty && <Notice>Apply your filter changes to update the reports and export.</Notice>}{vaultError && <Notice error>{vaultError}</Notice>}{error && <Notice error>{error} <button className="text-link" onClick={() => load()} disabled={loading}>Retry search</button></Notice>}{exportStatus && <Notice>{exportStatus}</Notice>}
    {loading && <Loading label="Consulting the ledger archives" />}
    {report && <>
      <div className="archives-totals" aria-label="Filtered totals"><div><p className="eyebrow">INCOME</p><strong>{exactMoney(report.totals.income)} ₮</strong></div><div><p className="eyebrow">SPENDING</p><strong>{exactMoney(report.totals.spending)} ₮</strong></div><div><p className="eyebrow">NET FLOW</p><strong>{exactMoney(report.totals.net)} ₮</strong></div><div><p className="eyebrow">MATCHING ENTRIES</p><strong>{report.totals.count}</strong><small>{report.totals.transferEntries} transfer entries</small></div></div>
      <p className="fine-print">Reports cover all matching entries, including pages not yet loaded. Linked transfers are excluded from income, spending, net flow and category totals. Net flow is not a vault balance.</p>
      <div className="archives-reports"><section className="form-panel"><p className="eyebrow">MONTHLY ACCOUNT</p><h2>Income & spending</h2>{report.monthly.length ? <div className="archives-table-scroll"><table><caption className="sr-only">Monthly totals for matching entries, in throne gelt</caption><thead><tr><th scope="col">Month (UTC)</th><th scope="col">Income</th><th scope="col">Spending</th><th scope="col">Net</th></tr></thead><tbody>{report.monthly.map(row => <tr key={row.month}><th scope="row">{row.month}</th><td>{exactMoney(row.income)}</td><td>{exactMoney(row.spending)}</td><td>{exactMoney(row.net)}</td></tr>)}</tbody></table></div> : <p className="muted">No monthly activity matches these filters.</p>}</section>
      <section className="form-panel"><p className="eyebrow">ALLOCATION REGISTER</p><h2>Category breakdown</h2>{report.categories.length ? <ul className="category-register">{report.categories.map(row => <li key={row.category}><strong>{row.category || 'Uncategorized'}</strong><div><span>Income {exactMoney(row.income)} ₮</span><span>Spending {exactMoney(row.spending)} ₮</span></div><div className="category-track" aria-hidden="true"><span style={{width:`${Math.min(100,Number(report.totals.spending) > 0 ? Number(row.spending)/Number(report.totals.spending)*100 : 0)}%`}} /></div></li>)}</ul> : <p className="muted">No non-transfer activity matches these filters.</p>}</section></div>
      <section className="ledger"><div className="section-heading-row"><div><p className="eyebrow">CROSS-VAULT RECORD</p><h2>Matching transactions</h2></div><span className="count-label">{report.entries.length} OF {report.totals.count} · NEWEST RECORDED FIRST</span></div>
        {catalog&&<><div className="button-row"><button className="btn btn-quiet" disabled={loading||labelsBusy||dirty} onClick={()=>setSelected(report.entries.slice(0,100).map(row=>row.id))}>Select up to 100 loaded entries</button><button className="btn btn-quiet" disabled={labelsBusy||!selected.length} onClick={()=>setSelected([])}>Clear selection</button></div><LedgerLabelActions selected={selected} catalog={catalog} disabled={loading||dirty} onBusy={setLabelsBusy} onSaved={async()=>{setSelected([]);await load();}}/></>}
        {!report.entries.length ? <Empty title="No matching entries.">Try a broader date range or reset your filters.</Empty> : <ol className="archives-entries">{report.entries.map(row => <li key={row.id}>{catalog&&<label className="ledger-select"><input type="checkbox" aria-label={`Select entry ${row.id}`} checked={selected.includes(row.id)} disabled={loading||labelsBusy||dirty||(!selected.includes(row.id)&&selected.length>=100)} onChange={e=>setSelected(old=>e.target.checked?[...old,row.id]:old.filter(id=>id!==row.id))}/>Select entry #{row.id}</label>}<details><summary><span className="archive-entry-main"><strong>{row.description}</strong><small>{row.createdAt ? new Date(row.createdAt).toISOString().slice(0,10) : 'Undated'} · {row.accountName || `Vault #${row.accountId}`} · {kind(row)}</small></span><span className="archive-entry-amount">{exactMoney(row.amount)} ₮</span><span aria-hidden="true">+</span></summary><div className="archive-entry-details"><div className="ledger-tags">{row.tags?.map(tag=><span className="ledger-tag" key={tag.id} style={{borderColor:tag.color}}><span style={{backgroundColor:tag.color}}/>{tag.name}{tag.archived?' (archived)':''}</span>)}</div><p>Entry #{row.id} · Category: {row.category || 'Uncategorized'}</p>{row.transferId && <p>Transfer reference: {row.transferId}</p>}<Link className="text-link" to={`/account/${row.accountId}`}>Open vault ledger →</Link></div></details></li>)}</ol>}
        {report.nextCursor && <button className="btn btn-outline" disabled={loading || exporting || dirty || labelsBusy} onClick={() => load(report.nextCursor)}>Load older entries</button>}
      </section>
    </>}
  </div>;
}

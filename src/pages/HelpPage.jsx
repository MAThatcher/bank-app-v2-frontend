import React from 'react';
import { Link } from 'react-router-dom';
const entries = [['How do I transfer between vaults?', 'Open Transfers from the navigation or select Transfer funds inside a vault. Choose a source and destination, enter an amount, then review and authorize. Both ledgers show the same transfer reference. If confirmation is interrupted, check the saved request again to avoid submitting a second transfer.'], ['How do I establish a vault?', 'Sign in and choose “Establish vault” from Vault command. Give your holding a name, then confirm. Your new vault opens with a zero balance.'], ['How do I record a deposit or withdrawal?', 'Open a vault and select “Record transaction.” Enter a positive amount for a deposit or a negative amount for a withdrawal. Add a description, then commit the entry to the ledger.'], ['Where can I inspect a transaction?', 'Open the vault ledger and select an entry to reveal its reference, full description, and recorded date. The newest entries appear first.'], ['Why must I verify my vox-mail?', 'Verification completes your enrollment. Open the link sent to your registered email address before attempting to access your vault.'], ['How do I recover my security cipher?', 'Select “Forgot your cipher?” on the access screen. Request a reset link using your verified email address, then follow the instructions in your inbox.'], ['Why was my withdrawal declined?', 'An account without overdraft permission cannot be reduced below zero. Check the vault’s overdraft status and current holdings before submitting a withdrawal.']];
export default function HelpPage() {
  return <div className="help-page">
    <section className="help-hero"><div className="imperial-header">
      <p className="eyebrow">ADEPTUS ADMINISTRATUM / IMPERIAL ARCHIVES</p>
      <h1>Cogitator archives</h1><p>Consult the records. Fulfill your duty.</p>
    </div></section>
    <section aria-label="Banking guidance" className="archive-faq">
      {entries.map(([question, answer], index) => <details key={question}>
        <summary><span className="eyebrow">{String(index + 1).padStart(2, '0')}</span><span>{question}</span><span className="faq-marker" aria-hidden="true">+</span></summary>
        <p>{answer}</p>
      </details>)}
    </section>
    <div className="purity-seal-footer"><p>Further guidance from the Administratum</p><Link className="text-link" to="/contact">Contact the scribes →</Link></div>
  </div>;
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Aquila } from './Imperial';
export default function AuthLayout({
  eyebrow,
  title,
  description,
  children
}) {
  return <div className="auth-shell"><aside className="auth-shrine"><p className="eyebrow">SANCTUM IMPERIALIS / TERRA</p><Aquila /><div><p className="eyebrow">IN HIS NAME</p><h2>Faith is our shield.<br />Duty, our currency.</h2><p>By authority of the Golden Throne.<br />In service to the Imperium of Man.</p></div><span className="shrine-seal">++ THE EMPEROR PROTECTS ++</span></aside><section className="auth-panel"><Link className="back-link" to="/">← Return to the sanctum</Link><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="lede">{description}</p>{children}<p className="form-inscription">ADEPTUS ADMINISTRATUM · DIVISIO FINANCIA</p></section></div>;
}

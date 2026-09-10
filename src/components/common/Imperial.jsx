import React from 'react';
import aquila from '../../assets/images/40k_imperial_aquila__transparent__by_fuguestock_d91enql-fullview.png';
export function Aquila({
  className = ''
}) {
  return <img className={'aquila ' + className} src={aquila} alt="Imperial Aquila" />;
}
export function Sigil({
  children = 'I'
}) {
  return <span className="sigil" aria-hidden="true">{children}</span>;
}
export function PageHeading({
  eyebrow,
  title,
  children,
  action
}) {
  return <div className="page-heading"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{children && <p className="lede">{children}</p>}</div>{action}</div>;
}
export function Notice({
  children,
  error = false
}) {
  return <div className={'notice ' + (error ? 'notice-error' : '')} role={error ? 'alert' : 'status'}>{children}</div>;
}
export function Loading({
  label = 'Consulting the archives'
}) {
  return <div className="loading" role="status"><span className="loader" aria-hidden="true" />{label}…</div>;
}
export function Empty({
  title,
  children
}) {
  return <div className="empty-state"><Sigil>∅</Sigil><h2>{title}</h2><div>{children}</div></div>;
}
export const money = value => new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(Number(value) || 0);

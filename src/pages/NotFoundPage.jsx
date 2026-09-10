import React from 'react';
import { Link } from 'react-router-dom';
import { Aquila } from '../components/common/Imperial';
export default function NotFoundPage() {
  return <div className="lost-page"><Aquila /><p className="eyebrow">ARCHIVE ERROR / 404</p><h1>Lost in the warp.</h1><p>This record could not be located in the Imperial archives.</p><Link className="btn btn-primary" to="/">Return to the sanctum →</Link></div>;
}

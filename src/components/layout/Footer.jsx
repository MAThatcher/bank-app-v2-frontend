import React from 'react';
import { Link } from 'react-router-dom';
import { Aquila } from '../common/Imperial';
export default function Footer() {
  return <footer className="site-footer"><div className="footer-brand"><Aquila /><div><strong>THE EMPEROR PROTECTS.</strong><p>Your wealth serves the Imperium.</p></div></div><nav aria-label="Footer navigation"><Link to="/contact">Contact the scribes</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/compliance">Compliance</Link></nav><div className="footer-code">TERRA / M41<br />ADEPTUS ADMINISTRATUM</div></footer>;
}

import React from 'react';
 // Make sure to add styles here

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__columns">
          <div className="footer__col footer__card">
            <h3 className="footer__col-title">
              <i className="icon-services"></i> <span>Our Services</span>
            </h3>
            <nav className="footer__nav">
              <ul className="footer__nav-list">
                <li className="footer__nav-item">
                  <a href="#" className="footer__nav-link">Custom Tailoring</a>
                </li>
                <li className="footer__nav-item">
                  <a href="#" className="footer__nav-link">Alterations</a>
                </li>
                <li className="footer__nav-item">
                  <a href="#" className="footer__nav-link">Fabric Selection</a>
                </li>
                <li className="footer__nav-item">
                  <a href="#" className="footer__nav-link">Measurements Guide</a>
                </li>
                <li className="footer__nav-item">
                  <a href="#" className="footer__nav-link">Delivery and Returns</a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="footer__col footer__card">
            <h3 className="footer__col-title">
              <i className="icon-social"></i> <span>Follow Us</span>
            </h3>
            <nav className="footer__nav">
              <ul className="footer__nav-list">
                <li className="footer__nav-item">
                  <a href="#" className="footer__nav-link">
                    <i className="icon-instagram"></i><span>Instagram</span>
                  </a>
                </li>
                <li className="footer__nav-item">
                  <a href="#" className="footer__nav-link">
                    <i className="icon-facebook"></i><span>Facebook</span>
                  </a>
                </li>
                <li className="footer__nav-item">
                  <a href="#" className="footer__nav-link">
                    <i className="icon-pinterest"></i><span>Pinterest</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="footer__col footer__card">
            <h3 className="footer__col-title">
              <i className="icon-contact"></i> <span>Contact Us</span>
            </h3>
            <nav className="footer__nav">
              <ul className="footer__nav-list">
                <li className="footer__nav-item">
                  <a href="mailto:tailor@example.com" className="footer__nav-link">
                    tailor@example.com
                  </a>
                </li>
                <li className="footer__nav-item">
                  <a href="tel:+123456789" className="footer__nav-link">
                    +123 456 789
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <div className="footer__copyrights">
          <p>&copy; {new Date().getFullYear()} TailorNest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

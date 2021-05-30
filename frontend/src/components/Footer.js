import React from "react";
import './Footer.css';

function Footer() {
  return (
    <div>
        <section className="contact-area" id="contact">
        <div className="container">
            <div className="row">
                <div className="col-lg-6 offset-lg-3">
                    <div className="contact-content text-center">
                        <a href="#">
                            <img src="https://i.ibb.co/QDy827D/ak-logo.png" alt="logo"/>
                        </a>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum </p>
                        <div className="hr"></div>
                        <h6>1120 Lorem ipsum dolor sit amet, KC 179050, Chandigarh.</h6>
                        <h6>+01 2345 6789 12<span>|</span>+01 2345 6789 12</h6>
                        <div className="contact-social">
                            <ul>
                                <li><a className="hover-target" href=""><i className="fab fa-facebook-f"></i></a></li>
                                <li><a className="hover-target" href=""><i className="fab fa-linkedin-in"></i></a></li>
                                <li><a className="hover-target" href=""><i className="fab fa-github"></i></a></li>
                                <li><a className="hover-target" href=""><i className="fab fa-behance"></i></a></li>
                                <li><a className="hover-target" href=""><i className="fab fa-pinterest-p"></i></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <footer>
        <p>Copyright &copy; 2019 <img src="https://i.ibb.co/QDy827D/ak-logo.png" alt="logo"/> All Rights Reserved.</p>
    </footer>
    </div>
  );
}

export default Footer;

import React from 'react'
import logoSvg from '../src/assets/svg/logo.svg';
import { Link } from 'react-router-dom';

function Nav() {
    return (
        <div>
            <nav class={`nav background`}>
                <ul class="nav__left">
                    <li>
                        <Link to={'/'}>
                            <img src={logoSvg} Linklt="" />
                        </Link>
                    </li>
                </ul>
                <ul class="nav__center">
                    <li><Link to="/">HOME</Link></li>
                    <li><Link to="/">PLACES</Link></li>
                    <li><Link to="/">ABOUT</Link></li>
                    <li><Link to="/">HOTELS</Link></li>
                </ul>
                <div class="nav__right">
                    <div class="navberger">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Nav
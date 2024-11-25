import React, { useState } from 'react'
import logoSvg from '../src/assets/svg/logo.svg';
import { Link } from 'react-router-dom';

function Nav() {
    const [open, setOpen] = useState();
    return (
        <div>
            <nav class={`nav background`} style={{justifyContent: "start"}}>
                <ul class="nav__left">
                    <li>
                        <Link to={'/'}>
                            <img src={logoSvg} Linklt="" />
                        </Link>
                    </li>
                </ul>
            </nav>
            {/* <div class={`menumobil ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
                <ul>
                    <li><a href="#slider">HOME</a></li>
                    <li><a href="#activites">PLACES</a></li>
                    <li><a href="#aboutUs">ABOUT</a></li>
                    <li><a href="#section-hotels">HOTELS</a></li>
                </ul>
            </div> */}
        </div>
    )
}

export default Nav
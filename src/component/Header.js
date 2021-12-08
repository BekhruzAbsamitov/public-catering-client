import React, {useEffect, useState} from 'react';
import {
    Navbar,
    NavbarBrand,
    Button, Nav, NavItem, NavLink,
} from 'reactstrap';
import {TOKEN} from "../utils/constants";
import jwtDecode from "jwt-decode";

function Header() {

    const [role, setRole] = useState()

    function removeToken() {
        localStorage.removeItem(TOKEN)
        window.location.reload()
    }

    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            if (jwtDecode(localStorage.getItem(TOKEN)).roles[0].roleName === 'ROLE_ADMIN') {
                setRole('ROLE_ADMIN')
            } else {
                setRole('ROLE_USER')
            }
        }
    }, [])

    return (
        <div>
            <Navbar color="info" className={'bg-success text-white'} light expand="md">
                <NavbarBrand className={'text-white bold m-1'}>Public Catering</NavbarBrand>

                <Nav className="ms-5" navbar>
                    <NavItem className={"ml-2"}>
                        <NavLink className={"text-white"} disabled={role === undefined}
                                 href={"/admin-main"}>Main</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={'text-white'} disabled={role === undefined}
                                 href={'/restaurants'}>Restaurants</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={'text-white'} disabled={role === undefined}
                                 href={'/grocery-stores'}>Grocery Stores</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={'text-white'} disabled={role === undefined}
                                 href={'/payment'}>Payments</NavLink>
                    </NavItem>

                </Nav>
                {localStorage.getItem(TOKEN) ?
                    <Button onClick={removeToken} className={'ms-auto m-1'} color={'danger'} size={'sm'}>Sign
                        Out</Button> :
                    ''}
            </Navbar>
        </div>

    );
}

export default Header
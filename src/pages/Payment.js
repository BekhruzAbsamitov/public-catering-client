import React, {useContext, useEffect, useState} from "react";
import {TOKEN} from "../utils/constants";
import {requestGet, requestGetWithParams} from "../utils/Requests";
import {paths} from "../paths/paths";
import {GlobalContext} from "../App";
import jwtDecode from "jwt-decode";
import {Col, Row, Table} from "reactstrap";

function Payment({history}) {

    const [isAdmin, setIsAdmin] = useState(false);
    const [payments, setPayments] = useState([])


    async function checkRole() {
        let token = jwtDecode(localStorage.getItem(TOKEN));
        if (token.roles[0].roleName === 'ROLE_ADMIN') {
            setIsAdmin(true)
        }
    }

    async function getPayments() {
        requestGetWithParams(paths.getPayments + '?roleName=' + (isAdmin ? "ROLE_ADMIN" : "ROLE_USER")).then(res => {
            setPayments(res.data.object)
        })
    }

    const value = useContext(GlobalContext);

    async function getUser() {
        return await requestGet(paths.authToken);
    }

    console.log(payments)

    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            getUser().then(res => {
                if (res.data && res.status === 200) {
                    value.setLogged(true);
                    checkRole().then()
                    value.setUser(res.data.result);
                    getPayments().then()
                }
            }).catch(() => {
                localStorage.removeItem(TOKEN);
                value.setLogged(false);
                value.setUser('');
                history.push("/");
            })
        } else {
            value.setLogged(false);
            value.setUser('');
            history.push("/");
        }
    }, [])
    return (
        <div>
            <Row>
                <Col xs={4}><h3>Payments</h3></Col>
            </Row>
            {isAdmin ?
                <Table striped bordered hover className={'text-center'}>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Message</th>
                        <th>Transaction Id</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {payments.map((res, index) =>
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{res.citizen.firstName + " " + res.citizen.lastName}</td>
                            <td>{res.message}</td>
                            <td>{res.transactionId}</td>
                            <td>{res.amount}</td>
                            <td>{res.success ? "OK" : "Fail"}</td>
                        </tr>
                    )}
                    </tbody>
                </Table> :
                <Table striped bordered hover className={'text-center'}>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Message</th>
                        <th>Transaction Id</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {payments.map((res, index) =>
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{res.message}</td>
                            <td>{res.transactionId}</td>
                            <td>{res.amount}</td>
                            <td>{res.success ? "OK" : "Fail"}</td>
                        </tr>
                    )}
                    </tbody>
                </Table>}

        </div>
    )
}

export default Payment
import React, {useContext, useEffect, useState} from "react";
import {TOKEN} from "../utils/constants";
import {GlobalContext} from "../App";
import {useParams} from "react-router-dom";
import {requestGet} from "../utils/Requests";
import {paths} from "../paths/paths";
import {Table} from "reactstrap";

function Reservations({history}) {

    const value = useContext(GlobalContext);

    const [user, setUser] = useState({})
    const [reservations, setReservations] = useState([])

    let params = useParams();

    async function getUser() {
        return await requestGet(paths.authToken);
    }

    async function getReservations(id) {
        return await requestGet(paths.getReservationByResId + id).then(res => {
                setReservations(res.data.object)
            }
        );
    }

    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            getUser().then(res => {
                if (res?.data && res?.status === 200) {
                    setUser(res.data.object)
                    value.setLogged(true);
                    value.setUser(res.data.result);
                    getReservations(parseInt(params.res_id)).then()
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
            <h3 className={'mt-3'}>Reservation List</h3>
            <Table striped bordered hover className={'text-center'}>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Guest Number</th>
                    <th>Table</th>
                    <th>Customer</th>
                    <th>Description</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {reservations.map(((result, index) =>
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{(new Date(Date.parse(result.date))).toString().substr(0, 24)}</td>
                            <td>{result.guestNumber}</td>
                            <td>No: {result.table.id}</td>
                            <td>{result.customer.firstName + " " + result.customer.lastName}</td>
                            <td>{result.description}</td>
                            <td>{result.payed ? 'Paid' : 'Unpaid'}</td>
                        </tr>
                ))}
                </tbody>
            </Table>
        </div>
    )
}



export default Reservations
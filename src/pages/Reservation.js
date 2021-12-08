import {useParams} from "react-router-dom";
import React, {useState, useEffect, useContext} from "react";
import {Button, Form, FormGroup, Input, Label, Table, Modal, Row, Col} from "reactstrap";
import {requestGet, requestPost, requestPut} from "../utils/Requests";
import {paths} from "../paths/paths";
import {RESERVATION_REDIRECT_URL, TOKEN} from "../utils/constants";
import {GlobalContext} from "../App";
import {ModalBody, ModalFooter} from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import Feedback from "react-bootstrap/Feedback";
import {toast} from "react-toastify";

function Reservation({history}) {

    const value = useContext(GlobalContext);

    const notify = (message) => toast(message);

    const params = useParams();
    const {id, reservation_id} = params

    async function getUser() {
        return await requestGet(paths.authToken);
    }

    const [reservations, setReservations] = useState([])
    const [user, setUser] = useState({})
    const [modal, setModal] = useState(false);
    const [newRes, setNewReservation] = useState({
        guestNumber: 10,
        restaurantId: id,
        customerId: user?.id,
        tableId: 1,
        description: '',
        date: '',
        time: '',
        isPayed: false
    });
    const [tables, setTables] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [redirectUrl, setRedirectUrl] = useState({
        id: '',
        url: ''
    });

    const onChange = (e) => {
        const {name, value} = e.target

        setNewReservation(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    async function getReservations(cardNumber) {
        return await requestGet(paths.getReservation + cardNumber).then(res => {
            setReservations(res.data.object);
        })
    }

    async function getAvailableTables(restaurantId) {
        return await requestGet(paths.getAvailableTables + restaurantId).then(res => {
            setTables(res?.data?.object)
        })
    }

    function confirmPayment(reservationId) {
        return requestPut(
            paths.changeReservationPaymentStatus + reservationId, {
                isPayed: true
            })
            .then()
    }

    async function getRestaurants() {
        return await requestGet(paths.getRestaurants).then(res => {
            setRestaurants(res?.data?.object)
        })
    }

    async function getRedirectUrl(reservationId, restaurantId) {
        return await requestPost(paths.makePaymentForReservation, {
            id: reservationId,
            redirectURL: RESERVATION_REDIRECT_URL + restaurantId
        })
            .then(res => {
                let link = res.data.object;
                setRedirectUrl({
                    id: reservationId,
                    url: link.slice(link.search('object') + 9, link.length - 2)
                })
            })
    }

    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            if (reservation_id !== undefined)
                confirmPayment(reservation_id).then()
            getUser().then(res => {
                if (res?.data && res?.status === 200) {
                    setUser(res.data.object)

                    setNewReservation({
                        ...newRes,
                        customerId: res.data.object.id
                    })
                    value.setLogged(true);
                    getReservations(res.data.object.cardNumber).then()
                    getRestaurants().then()
                    getAvailableTables(id).then()
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
    const toggle = () => setModal(!modal);
    const closeBtn = <button className="close" onClick={toggle}>&times;</button>;

    function makeReservation() {
        requestPost(paths.makeReservation, newRes).then(res => {
            if (res.status === 200 && res.data) {
                notify("Reservation made!")
                window.location.reload()
            } else {
                notify("Error!")
            }
        })
    }

    function cancelReservation() {
        setRedirectUrl({
            ...redirectUrl,
            url: ''
        })
    }

    return (
        <div>
            <div className="row mt-5">
                <Row>
                    <Col>
                        <h4>Reservation List</h4>
                    </Col>
                    <Col>
                        <Button onClick={toggle} size={'sm'}>Make a reservation</Button>
                    </Col>
                </Row>
                <Table striped bordered hover className={'text-center'}>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Number of Guests</th>
                        <th>Restaurant</th>
                        <th>Table</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Payment status</th>
                        <th>Pay</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reservations?.map((res, index) =>
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{res.customer.firstName + ' ' + res.customer.lastName}</td>
                            <td>{(new Date(Date.parse(res?.date))).toString().substr(0, 24)}</td>
                            <td>{res.guestNumber}</td>
                            <td>{res.restaurant.name}</td>
                            <td>No: {res.table.id}</td>
                            <td>{res.description}</td>
                            <td>{res.table.price}</td>
                            <td>{res.payed ? 'Paid' : "Unpaid"}</td>
                            <td>{redirectUrl.url !== '' && redirectUrl.id === res.id ?
                                <>
                                    <Button size={'sm'} color={'info'} className={'m-1'}>
                                        <a className={'text-white'} href={redirectUrl.url}>Confirm</a>
                                    </Button>
                                    <Button size={'sm'} onClick={cancelReservation}>Cancel</Button>
                                </> :
                                <Button size={'sm'}
                                        onClick={() => getRedirectUrl(res.id, res.restaurant.id)}
                                        color={'danger'}
                                        disabled={res.payed}>
                                    Pay
                                </Button>
                            }
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader close={closeBtn}>Modal title</ModalHeader>
                    <Form>
                        <ModalBody>
                            <FormGroup>
                                <Label for={'guestNumber'}>Guest Number</Label>
                                <Input onChange={onChange} type={"number"} name={'guestNumber'} id={'guestNumber'}
                                       required/>
                                <Feedback>Guest must not be empty</Feedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for={'tableId'}>Available Tables</Label>
                                <Input onChange={onChange} type={"select"} name={'tableId'}
                                       id={'guestNumber'}
                                       required>
                                    {tables?.length <= 1 ? <option> Select table id</option> : ''}
                                    {tables?.map((table, index) =>
                                        <option key={index} value={table.id}>No: {table.id} |
                                            capacity: {table.capacity}</option>
                                    )}

                                </Input>
                                <Feedback>Guest must not be empty</Feedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for={'desc'}>Description</Label>
                                <Input onChange={onChange} type={"text"} name={'description'} id={'desc'}
                                       required/>
                                <Feedback>Description must not be empty</Feedback>
                            </FormGroup>

                            <FormGroup>
                                <Label for="exampleDate">Date</Label>
                                <Input
                                    onChange={onChange}
                                    type="date"
                                    name="date"
                                    id="exampleDate"
                                    placeholder="date placeholder"
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="exampleTime">Time</Label>
                                <Input
                                    onChange={onChange}
                                    type="time"
                                    name="time"
                                    id="exampleTime"
                                    placeholder="time placeholder"
                                />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button size={'sm'} color="primary" onClick={makeReservation}>Submit</Button>
                            <Button size={'sm'} color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </div>
        </div>
    )
}

export default Reservation

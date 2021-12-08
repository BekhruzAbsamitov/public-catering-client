import React, {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../App";
import {requestGet, requestPost, requestPut} from "../utils/Requests";
import {paths} from "../paths/paths";
import {ORDER_REDIRECT_URL, TOKEN, TOKEN_TYPE} from "../utils/constants";
import {Button, Modal, ModalBody, Row, Table} from "reactstrap";
import {Col} from "antd";
import ModalHeader from "react-bootstrap/ModalHeader";
import {useParams} from "react-router-dom";
import jwtDecode from "jwt-decode";

function Orders({history}) {

    const value = useContext(GlobalContext);

    const [user, setUser] = useState({})
    const [orders, setOrders] = useState([]);
    const [orderItems, setOrderItems] = useState([])
    const [modal, setModal] = useState(false)
    const [role, setRole] = useState('');
    const [redirectUrl, setRedirectUrl] = useState({
        id: '',
        url: ''
    });

    let {id} = useParams();


    async function getUser() {
        return await requestGet(paths.authToken);
    }

    async function getOrders(id) {
        return await requestGet(paths.getOrders).then(res => {
            setOrders(res.data.object)
        });
    }

    async function getOrderItems(orderId) {
        return await requestGet(paths.getOrderItems + orderId.toString()).then(res => {
            setOrderItems(res.data.object)
        })
    }


    async function getOrdersByStoreId(id) {
        return await requestGet(paths.getOrderByStoreId + id).then(res => {
            setOrders(res.data.object)
        })
    }

    async function getRedirectUrl(orderId) {
        return await requestPost(paths.makePaymentForOrder, {
            id: orderId,
            redirectURL: ORDER_REDIRECT_URL
        })
            .then(res => {
                let link = res.data.object;
                setRedirectUrl({
                    id: orderId,
                    url: link.slice(link.search('object') + 9, link.length - 2)
                })
            })
    }

    async function confirmPayment(orderId) {
        return await requestPut(paths.changePaymentStatus + orderId, {
            isPayed: true
        })
            .then()
    }

    function cancelOrder() {
        setRedirectUrl({
            ...redirectUrl,
            url: ''
        })
    }

    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            if (id !== undefined) {
                confirmPayment(id).then()
            }
            setRole(jwtDecode(localStorage.getItem(TOKEN)).roles[0].roleName)
            getUser().then(res => {
                if (res?.data && res?.status === 200) {
                    setUser(res.data.object)
                    value.setLogged(true);
                    value.setUser(res.data.result);
                    if (jwtDecode(localStorage.getItem(TOKEN)).roles[0].roleName === 'ROLE_ADMIN') {
                        getOrdersByStoreId(id).then()
                    } else {
                        getOrders(id).then()
                    }
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
    const toggle = (orderId) => {
        setModal(!modal);
        if (!modal)
            getOrderItems(orderId).then()
    }
    const closeBtn = <button className="close" onClick={toggle}>&times;</button>;

    return (
        <div>
            <Row className={'mt-5'}>
                <Col><h3>Order List</h3></Col>
            </Row>
            <Table striped bordered hover className={'text-center'}>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Store</th>
                    <th>Order Date</th>
                    <th>Total price</th>
                    <th>Payment Status</th>
                    <th>Order Items</th>
                    <th>Payment</th>
                </tr>
                </thead>
                <tbody>
                {role === 'ROLE_ADMIN' ?
                    orders.map((res, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{res.groceryStore.name}</td>
                                <td>{(new Date(Date.parse(res?.orderDate))).toString().substr(0, 24)}</td>
                                <td>{res.totalPrice}</td>
                                <td>{res.payed ? "Paid" : "Unpaid"}</td>
                                <td><Button onClick={() => toggle(res.id)} size={'sm'} className={'text-white'}
                                            color={'info'}>View</Button></td>
                                <td>{res.customer.firstName + " " + res.customer.lastName}</td>
                            </tr>
                        )
                    ) :
                    orders.map((res, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{res.groceryStore.name}</td>
                                <td>{(new Date(Date.parse(res?.orderDate))).toString().substr(0, 24)}</td>
                                <td>{res.totalPrice}</td>
                                <td>{res.payed ? "Paid" : "Unpaid"}</td>
                                <td><Button onClick={() => toggle(res.id)} size={'sm'} className={'text-white'}
                                            color={'info'}>View</Button></td>
                                <td>{redirectUrl.url !== '' && redirectUrl.id === res.id ?
                                    <>
                                        <Button size={'sm'} color={'info'} className={'m-1'}>
                                            <a className={'text-white'} href={redirectUrl.url}>Confirm</a>
                                        </Button>
                                        <Button size={'sm'} onClick={cancelOrder}>Cancel</Button>
                                    </> :
                                    <Button size={'sm'}
                                            onClick={() => getRedirectUrl(res.id)}
                                            color={'danger'}
                                            disabled={res.payed}>
                                        Pay
                                    </Button>
                                }</td>
                            </tr>
                        )
                    )
                }
                </tbody>
            </Table>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader close={closeBtn}>
                    <h6>Shopping Chart</h6>
                </ModalHeader>
                <ModalBody>
                    <Table>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orderItems.map((res, index) =>
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{res.product.name}</td>
                                <td>{res.quantity}</td>
                                <td>{res.price * res.quantity}</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default Orders
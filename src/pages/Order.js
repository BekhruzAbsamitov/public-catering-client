import {Link, useParams} from "react-router-dom";
import {Button, ButtonGroup, Col, Row, Table} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {BASE_URL, TOKEN} from "../utils/constants";
import {GlobalContext} from "../App";
import {requestGet, requestPost} from "../utils/Requests";
import {paths} from "../paths/paths";
import ModalHeader from "react-bootstrap/ModalHeader";
import {Form, Modal, ModalBody, ModalFooter,} from "reactstrap";

function Order({history}) {

    const value = useContext(GlobalContext);

    const {id} = useParams()

    const [user, setUser] = useState({})
    const [photoModal, setPhotoModal] = useState(false);
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    const [items, setItems] = useState([]);
    const [modal, setModal] = useState(false)
    const [currentPhotoId, setCurrentPhotoId] = useState('');
    const [order, setOrder] = useState({
        total: calcTotalPrice(),
        storeId: id,
        items: items
    })


    async function getUser() {
        return await requestGet(paths.authToken);
    }

    async function getCategories() {
        return await requestGet(paths.getCategories).then(res => {
            setCategories(res.data.object)
        })
    }

    async function getProducts(storeId) {
        return await requestGet(paths.getActiveProducts + storeId).then(res => {
            setProducts(res.data.object)
        })
    }

    function calcTotalPrice() {
        let totalPrice = 0;
        items.forEach(i => totalPrice += i.price * i.amount)
        return totalPrice;
    }

    function add(id, name, price) {
        const exists = items.filter((i) => i.productId === id);
        if (exists.length) {
            setItems((prev) => {
                const filtered = prev.filter((item) => item.productId !== id);

                exists[0].amount++;

                return [...filtered, ...exists];
            });
        } else {
            setItems((prev) => {
                const newProduct = {
                    productId: id,
                    name: name,
                    price: price,
                    amount: 1,
                };
                return [...prev, newProduct];
            });
        }
    }

    function sub(id) {
        const exists = items.filter((i) => i.productId === id);
        if (exists.length) {
            setItems((prev) => {
                const filtered = prev.filter((item) => item.productId !== id);

                exists[0].amount--;

                return [...filtered, ...exists];
            });
        }
    }

    function saveItems() {
        requestPost(paths.saveOrder, order).then(res => {
            window.location.reload()
        })
    }

    const toggle = () => {
        setModal(!modal);
        setOrder({
            storeId: id,
            total: calcTotalPrice(),
            items: items
        })
    }
    const closeBtn = <button className="close" onClick={toggle}>&times;</button>;


    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            getUser().then(res => {
                if (res?.data && res?.status === 200) {
                    setUser(res.data.object)
                    value.setLogged(true);
                    value.setUser(res.data.result);
                    getProducts(id).then()
                    getCategories().then()

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


    const photoToggle = (id) => {
        setPhotoModal(!photoModal);
        if (!photoModal)
            setCurrentPhotoId(id)
    }

    return (
        <div>
            <div className={'mt-5'}>
                <Row>
                    <Col><h3>Product List</h3></Col>
                    <Col><Button onClick={toggle} size={'sm'}>Shopping Cart</Button></Col>
                    <Col>
                        <Link className={'text-white btn btn-sm btn-success'} to={'/orders'}>Order List</Link>
                    </Col>
                </Row>
                <Table striped bordered hover className={'text-center'}>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Photo</th>
                        <th>Order</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products?.map((res, index) => (

                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{res.name}</td>
                                <td>{res.description}</td>
                                <td>{res.price}</td>
                                <td>{res.category}</td>
                                <td><Button size={'sm'} onClick={() => photoToggle(res.photo?.id)}
                                            className={'text-white'} color={'warning'}>View</Button>
                                </td>
                                <td>
                                    <ButtonGroup size={'sm'} className="me-1" aria-label="First group">
                                        <Button disabled={items.filter(i => i.productId === res.id)[0]?.amount === 0}
                                                onClick={() => sub(res.id)} className={'fw-bold'}>-</Button>
                                        <Button>{items.filter(i => i.productId === res.id)[0]?.amount || 0}</Button>
                                        <Button onClick={() => add(res.id, res.name, res.price)}
                                                className={'fw-bold'}>+</Button>
                                    </ButtonGroup>
                                </td>
                            </tr>
                        )
                    )}
                    </tbody>
                </Table>
            </div>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader close={closeBtn}>
                    <h6>Shopping Chart</h6>
                </ModalHeader>
                <Form onSubmit={saveItems}>
                    <ModalBody>
                        <Table>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Product Name</th>
                                <th>Amount</th>
                                <th>Price</th>
                            </tr>
                            </thead>
                            <tbody>
                            {items.map((res, index) =>
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{res.name}</td>
                                    <td>{res.amount}</td>
                                    <td>{res.price * res.amount}</td>
                                </tr>)
                            }
                            </tbody>
                            <tfoot>
                            <tr>
                                <td><h6>Total price: {calcTotalPrice()}</h6></td>
                            </tr>
                            </tfoot>
                        </Table>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" size={'sm'} onClick={saveItems}>Make Order</Button>
                        <Button color="secondary" size={'sm'} onClick={toggle}>Cancel</Button>
                    </ModalFooter>
                </Form>
            </Modal>
            <Modal isOpen={photoModal} toggle={photoToggle}>
                <ModalHeader close={closeBtn}>
                    <h6>Product Photo</h6>
                </ModalHeader>
                <ModalBody>
                    <img width={'465px'} src={BASE_URL + paths.downloadFile + currentPhotoId} alt=""/>
                </ModalBody>
            </Modal>
        </div>
    )

}

export default Order
import React, {useContext, useEffect, useState} from 'react';
import {requestGet} from "../utils/Requests";
import {paths} from "../paths/paths";
import {BASE_URL, TOKEN} from "../utils/constants";
import {GlobalContext} from "../App";
import {Link} from "react-router-dom";
import {Row, Table} from "react-bootstrap";
import {Button, Col, Modal, ModalBody} from "reactstrap";
import ModalHeader from "react-bootstrap/ModalHeader";

function UserMain({history}) {

    const [restaurant, setRestaurant] = useState([]);
    const [store, setStore] = useState([]);
    const [restaurantId, setRestaurantId] = useState(0);
    const [user, setUser] = useState({});
    const [photoModal, setPhotoModal] = useState(false);
    const [currentPhotoId, setCurrentPhotoId] = useState('');


    const value = useContext(GlobalContext);

    async function getRestaurants() {
        return await requestGet(paths.restaurant).then(res => {
            setRestaurant(res.data.object);
        })
    }

    async function getUser() {
        return await requestGet(paths.authToken);
    }

    async function getStores() {
        return await requestGet(paths.store).then(res => {
            setStore(res.data.object);
        })
    }

    const photoToggle = (id) => {
        setPhotoModal(!photoModal);
        if (!photoModal)
            setCurrentPhotoId(id)
    }
    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            getUser().then(res => {
                if (res.data && res.status === 200) {
                    value.setLogged(true);
                    value.setUser(res.data.object);
                    setUser(res.data.object)
                    getRestaurants().then();
                    getStores().then()
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
    const closeBtn = <button className="close" onClick={photoToggle}>&times;</button>;

    return (
        <div className={'mt-2'}>
            <Row>
                <Col xs={4}>
                    <h3>Grocery Store</h3>
                </Col>
                <Col xs={4}>
                    <Link to={'/payment'} className={'btn-sm btn btn-success'}>Payments</Link>
                    <Link className={'btn btn-sm'} to={'/restaurants'}>REs</Link>
                    <Link className={'btn btn-sm'} to={'/grocery-stores'}>Stores</Link>

                </Col>
            </Row>
            <Table striped bordered hover className={'text-center'}>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Description</th>
                    <th>Phone Number</th>
                    <th>Photo</th>
                    <th>Make an order</th>
                </tr>
                </thead>
                <tbody>
                {store?.map((res, index) =>
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{res.name}</td>
                        <td>{res.address}</td>
                        <td>{res.description}</td>
                        <td>{res.phoneNumber}</td>
                        <td><Button size={'sm'} onClick={() => photoToggle(res.photo.id)}
                                    className={'text-white'} color={'warning'}>View</Button></td>
                        <td>

                            <Link className={'text-white btn btn-sm btn-danger'} to={`/order/${res.id}`}>Order</Link>

                        </td>
                    </tr>)}
                </tbody>
            </Table>
            <Row className={'mt-3'}>
                <Col xs='4'>
                    <h3>Restaurants</h3>
                </Col>
            </Row>
            <Table striped bordered hover className={'text-center'}>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Description</th>
                    <th>Phone Number</th>
                    <th>Photo</th>
                    <th>Reserve</th>
                </tr>
                </thead>
                <tbody>
                {restaurant.map(((res, index) =>
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{res.name}</td>
                            <td>{res.address}</td>
                            <td>{res.description}</td>
                            <td>{res.phoneNumber}</td>
                            <td><Button size={'sm'} onClick={() => photoToggle(res.photo.id)}
                                        className={'text-white'} color={'warning'}>View</Button></td>
                            <td>
                                <Link className={'text-white btn btn-sm btn-info'}
                                      to={`/reservation/${res.id}`}>Reserve</Link>
                            </td>
                        </tr>
                ))}
                </tbody>
            </Table>
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

export default UserMain;
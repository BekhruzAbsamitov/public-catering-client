import React, {useContext, useEffect, useState} from 'react';
import {Button, Col, Form, FormGroup, Input, Label, Modal, Row, Table} from "reactstrap";
import {requestGet, requestPost} from "../utils/Requests";
import {paths} from "../paths/paths";
import {BASE_URL, TOKEN} from "../utils/constants";
import {GlobalContext} from "../App";
import {Link} from "react-router-dom";
import ModalHeader from "react-bootstrap/ModalHeader";
import {ModalBody, ModalFooter} from "react-bootstrap";
import axios from "axios";
import {toast} from "react-toastify";
import 'antd/dist/antd.css'

function AdminMain({history}) {

    const [restaurants, setRestaurants] = useState([]);
    const [store, setStore] = useState([]);
    const [resModal, setResModal] = useState(false);
    const [storeModal, setStoreModal] = useState(false);
    const [districts, setDistricts] = useState([])
    const [streets, setStreets] = useState([]);
    const [commercialBuildings, setCommercialBuildings] = useState([])
    const [offices, setOffices] = useState([]);
    const [attachment, setAttachment] = useState({})
    const [photoModal, setPhotoModal] = useState(false);
    const [currentPhotoId, setCurrentPhotoId] = useState('');
    const [newBuild, setNewBuild] = useState({
        name: '',
        description: '',
        phoneNumber: '',
        attachmentId: '',
        homeId: 0,
        active: true,
        districtId: 0,
        streetId: 0,
        buildingId: 0
    });

    const onChange = (e) => {
        const {name, value} = e.target

        setNewBuild(prev => {
            return {
                ...prev,
                [name]: value,
                attachmentId: attachment.id
            }
        })
    }


    const value = useContext(GlobalContext);

    async function getRestaurants() {
        return await requestGet(paths.restaurant).then(res => {
            setRestaurants(res.data.object);
        })
    }

    async function getUser() {
        return await requestGet(paths.authToken);
    }

    async function getStores() {
        return await requestGet(paths.allStores).then(res => {
            setStore(res.data.object);
        })
    }

    async function getDistricts() {
        return await axios.get('http://citymanagementfull-env.eba-tixcjyas.us-east-2.elasticbeanstalk.com/api/v1/address/district')
            .then(res => setDistricts(res.data.result))
    }

    async function getStreets(districtId) {
        return await axios.get('http://citymanagementfull-env.eba-tixcjyas.us-east-2.elasticbeanstalk.com/api/v1/address/street?districtId=' + districtId)
            .then(res => setStreets(res.data.result))
    }

    async function getBuildings(streetId) {
        return await axios.get('http://citymanagementfull-env.eba-tixcjyas.us-east-2.elasticbeanstalk.com/api/v1/address/commercialBuildings?streetId=' + streetId)
            .then(res => setCommercialBuildings(res.data.result))
    }

    async function getOffices(buildingId) {
        return await axios.get('http://citymanagementfull-env.eba-tixcjyas.us-east-2.elasticbeanstalk.com/api/v1/address/offices?buildingId=' + buildingId)
            .then(res => setOffices(res.data.result))
    }

    function test() {

        getStreets(newBuild.districtId).then()
        getBuildings(newBuild.streetId).then()
        getOffices(newBuild.buildingId).then()
    }

    function handleOnSubmitRes() {
        requestPost(paths.addRestaurant, newBuild).then(res => {
            if (res.status === 200 && res.data) {
                toast.success("Restaurant added");
                window.location.reload()
            } else {
                toast.error("Something wrong!")
            }
        })
    }

    function handleOnSubmitStore() {
        requestPost(paths.addGroceryStore, newBuild).then(res => {
            if (res.status === 200 && res.data) {
                toast.success("Restaurant added");
                window.location.reload()
            } else {
                toast.error("Something wrong!")
            }
        })
    }


    function checkOutRes(active, id) {
        requestPost(paths.changeResActiveStatus + id,
            {active: active}
        ).then(res => {
            window.location.reload()

        })
        getRestaurants().then()
    }

    function checkOutStore(active, id) {
        requestPost(paths.changeStoreActiveStatus + id, {active: active}).then()
        window.location.reload()
    }

    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            getUser().then(res => {
                if (res.data && res.status === 200) {
                    value.setLogged(true);
                    value.setUser(res.data.result);
                    getRestaurants().then();
                    getStores().then()
                    getDistricts().then()
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

    const resToggle = () => setResModal(!resModal);
    const closeResBtn = <button className="close" onClick={resToggle}>&times;</button>;

    const storeToggle = () => setStoreModal(!storeModal);
    const closeStoreBtn = <button className="close" onClick={storeToggle}>&times;</button>;

    async function uploadPhoto(res) {
        const formData = new FormData();
        formData.append('file', res.target.files[0])
        return await requestPost(paths.uploadFile, formData).then(r => {
            setAttachment(r.data.object)
        });
    }

    const photoToggle = (id) => {
        setPhotoModal(!photoModal);
        if (!photoModal)
            setCurrentPhotoId(id)
    }

    const closeBtn = <button className="close" onClick={photoToggle}>&times;</button>;

    console.log(newBuild)
    return (
        <div className="row row-cols-1 row-cols-md-3 g-4 mt-5">
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Restaurants</h5>
                        <p className="card-text">This is a longer card with supporting text below as a natural
                            lead-in to additional content. This content is a little bit longer.</p>
                        <Link to={'/restaurants'} className={'btn  btn-success btn-sm'}>View</Link>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Grocery Stores</h5>
                        <p className="card-text">This is a longer card with supporting text below as a natural
                            lead-in to additional content. This content is a little bit longer.</p>
                        <Link to={'/grocery-stores'} className={'btn btn-success btn-sm'}>View</Link>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Payments</h5>
                        <p className="card-text">This is a longer card with supporting text below as a natural
                            lead-in to additional content. This content is a little bit longer.</p>
                        <Link to={'/payment'} className={'btn btn-sm btn-success'}>View</Link>
                    </div>
                </div>
            </div>
        </div>
        /*
            <div className={'mt-2'}>
                <Row>
                    <Col xs={4}><h3>Restaurants</h3></Col>
                    <Col>
                        <Link className={'btn btn-sm'} to={'/restaurants'}>REs</Link>
                        <Link className={'btn btn-sm'} to={'/grocery-stores'}>Stores</Link>
                        <Button size={'sm'} className={'btn btn-success'} onClick={resToggle}>Add Restaurant</Button>
                        <Button size={'sm'} className={'btn btn-success m-1'} onClick={storeToggle}>Add Store</Button>
                        <Link to="/payment" className={'btn btn-success btn-sm'}>Payments</Link>
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
                        <th>Active</th>
                        <th>Tables</th>
                        <th>Reservations</th>
                    </tr>
                    </thead>
                    <tbody>
                    {restaurants.map(((res, index) =>
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{res.name}</td>
                                <td>{res.address}</td>
                                <td>{res.description}</td>
                                <td>{res.phoneNumber}</td>
                                <td><Button size={'sm'}
                                            onClick={() => photoToggle(res.photo.id)}
                                            className={'text-white'} color={'warning'}>View</Button></td>
                                <td>
                                    <Input checked={res.active} name={'active'}
                                           onChange={() => checkOutRes(!res.active, res.id)}
                                           type={'checkbox'}/>
                                </td>
                                <td>

                                    <Link className={'text-white btn btn-sm btn-success'}
                                          to={`/tables/${res.id}`}>Open</Link>

                                </td>
                                <td>

                                    <Link className={'text-white btn btn-sm btn-info'}
                                          to={`/reservation-list/${res.id}`}>Reservations</Link>

                                </td>
                            </tr>
                    ))}
                    </tbody>
                </Table>
                <h3>Grocery Store</h3>
                <Table striped bordered hover className={'text-center'}>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Description</th>
                        <th>Phone Number</th>
                        <th>Photo</th>
                        <th>Active</th>
                        <th>Products</th>
                        <th>Orders</th>
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
                            <td><Button size={'sm'} onClick={() => photoToggle(res.photo?.id)}
                                        className={'text-white'} color={'warning'}>View</Button></td>
                            <td>
                                <Input checked={res.active} name={'active'}
                                       onChange={() => checkOutStore(res.active, res.id)}
                                       type={'checkbox'}/>
                            </td>
                            <td><Link className={'text-white btn btn-sm btn-info'}
                                      to={`product/store-id/${res.id}`}>Open</Link>
                            </td>
                            <td><Link className={'text-white btn btn-sm btn-success'}
                                      to={`/orders/${res.id}`}>Orders</Link>
                            </td>
                        </tr>)}
                    </tbody>
                </Table>

                <Modal isOpen={resModal} toggle={resToggle}>
                    <ModalHeader close={closeResBtn}>New Restaurant</ModalHeader>
                    <Form>
                        <ModalBody>
                            <FormGroup>
                                <Label for={'name'}>Name</Label>
                                <Input name={'name'} bsSize={'sm'} onChange={onChange}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for={'desc'}>Description</Label>
                                <Input bsSize={'sm'} name={'description'} id={'desc'} onChange={onChange}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for={'num'}>Phone Number</Label>
                                <Input bsSize={'sm'} name={'phoneNumber'} id={'num'} onChange={onChange}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for={'photo'}>Photo</Label><br/>
                                <Input bsSize={'sm'} type={'file'}
                                       onChange={(e) => uploadPhoto(e)}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for={'district'}>Districts</Label>
                                <Input bsSize={'sm'} id={'district'} onChange={onChange}
                                       type={'select'} name={'districtId'} required>
                                    {districts.map((district, index) =>
                                        <option key={index} value={district.id}>{district.name}</option>
                                    )}
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for={'street'}>Streets</Label>
                                <Input bsSize={'sm'} id={'street'} onClick={test} onChange={onChange}
                                       type={'select'} name={'streetId'} required>
                                    {streets.map((street, index) =>
                                        <option key={index} value={street.id}>{street.name}</option>
                                    )}
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for={'building'}>Buildings</Label>
                                <Input bsSize={'sm'} id={'building'} onChange={onChange}
                                       type={'select'} onClick={test} name={'buildingId'} required>
                                    {commercialBuildings?.length <= 1 ? <option>Select buildings</option> : ''}
                                    {commercialBuildings.map((building, index) =>
                                        <option key={index} value={building.id}>{building.buildingNumber}</option>
                                    )}
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for={'office'}>Offices</Label>
                                <Input bsSize={'sm'} id={'office'} onChange={onChange}
                                       type={'select'} onClick={test} name={'homeId'} required>
                                    {offices?.length <= 1 ? <option>Select office</option> : ''}

                                    {offices.map((office, index) =>
                                        <option key={index} value={office.id}>{office.homeNumber}</option>
                                    )}
                                </Input>
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" size={'sm'} onClick={handleOnSubmitRes}>Create</Button>
                            <Button color="secondary" size={'sm'} onClick={resToggle}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>

                <Modal isOpen={storeModal} toggle={storeToggle}>
                    <ModalHeader close={closeStoreBtn}>New Grocery Store</ModalHeader>
                    <Form>
                        <ModalBody>
                            <FormGroup>
                                <Label for={'name'}>Name</Label>
                                <Input bsSize={'sm'} name={'name'} onChange={onChange}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for={'desc'}>Description</Label>
                                <Input bsSize={'sm'} name={'description'} id={'desc'} onChange={onChange}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for={'num'}>Phone Number</Label>
                                <Input bsSize={'sm'} name={'phoneNumber'} id={'num'} onChange={onChange}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for={'photo'}>Photo</Label><br/>
                                <Input bsSize={'sm'} type={'file'} onChange={(e) => uploadPhoto(e)}/>
                            </FormGroup>
                            <FormGroup>
                                <Label for={'district'}>Districts</Label>
                                <Input bsSize={'sm'} id={'district'} onChange={onChange}
                                       type={'select'} name={'districtId'} required>
                                    {districts.map((district, index) =>
                                        <option key={index} value={district.id}>{district.name}</option>
                                    )}
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for={'street'}>Streets</Label>
                                <Input bsSize={'sm'} id={'street'} onClick={test} onChange={onChange}
                                       type={'select'} name={'streetId'} required>
                                    {streets.map((street, index) =>
                                        <option key={index} value={street.id}>{street.name}</option>
                                    )}
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for={'building'}>Buildings</Label>
                                <Input bsSize={'sm'} id={'building'} onChange={onChange}
                                       type={'select'} onClick={test} name={'buildingId'} required>
                                    {commercialBuildings?.length <= 1 ? <option>Select buildings</option> : ''}
                                    {commercialBuildings.map((building, index) =>
                                        <option key={index} value={building.id}>{building.buildingNumber}</option>
                                    )}
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Label for={'office'}>Offices</Label>
                                <Input bsSize={'sm'} id={'office'} onChange={onChange}
                                       type={'select'} onClick={test} name={'homeId'} required>
                                    {offices?.length <= 1 ? <option>Select office</option> : ''}

                                    {offices.map((office, index) =>
                                        <option key={index} value={office.id}>{office.homeNumber}</option>
                                    )}
                                </Input>
                            </FormGroup>

                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" size={'sm'} onClick={handleOnSubmitStore}>Create</Button>{' '}
                            <Button color="secondary" size={'sm'} onClick={storeToggle}>Cancel</Button>
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
        */
    );
}

export default AdminMain;
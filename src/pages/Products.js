import React, {useContext, useEffect, useState} from "react";
import {BASE_URL, TOKEN} from "../utils/constants";
import {requestGet, requestPost} from "../utils/Requests";
import {paths} from "../paths/paths";
import {GlobalContext} from "../App";
import {useParams} from "react-router-dom";
import {Button, Col, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, Row, Table} from "reactstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import Feedback from "react-bootstrap/Feedback";
import {toast} from "react-toastify";

function Products({history}) {

    const value = useContext(GlobalContext);

    const {store_id} = useParams()

    const [modal, setModal] = useState(false);
    const [photoModal, setPhotoModal] = useState(false);
    const [user, setUser] = useState({})
    const [product, setProduct] = useState([])
    const [stores, setStores] = useState([])
    const [types, setTypes] = useState([])
    const [attachment, setAttachment] = useState({})
    const [currentPhotoId, setCurrentPhotoId] = useState(undefined);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: "",
        price: 0,
        photoId: '',
        storeId: store_id,
        productCategory: 'MEAT'
    })

    const category = [
        'PRODUCE',
        'MEAT',
        'BAKERY',
        'DAIRY'
    ]

    const onChange = (e) => {
        const {name, value} = e.target

        setNewProduct(prev => {
            return {
                ...prev,
                [name]: value,
                photoId: attachment.id
            }
        })
    }

    async function getUser() {
        return await requestGet(paths.authToken);
    }

    async function getProducts(id) {
        return await requestGet(paths.getProducts + id).then(r => {
            setProduct(r.data.object)
        })
    }

    async function getStores() {
        return await requestGet(paths.store).then(r => {
            setStores(r.data.object)
        })
    }

    async function getTypes() {
        return await requestGet(paths.getTypes).then(r =>
            setTypes(r.data.object)
        )
    }

    async function uploadPhoto(res) {
        const formData = new FormData();
        formData.append('file', res.target.files[0])
        return await requestPost(paths.uploadFile, formData).then(r => {
            setAttachment(r.data.object)
        });
    }


    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            getUser().then(res => {
                if (res?.data && res?.status === 200) {
                    setUser(res.data.object)
                    value.setLogged(true);
                    value.setUser(res.data.result);
                    getProducts(store_id).then()
                    getStores().then()
                    getTypes().then()
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
    const photoToggle = (id) => {
        setPhotoModal(!photoModal);
        if (!photoModal)
            setCurrentPhotoId(id)
    }
    const closeBtn = <button className="close" onClick={toggle}>&times;</button>;

    function addProduct(e) {
        requestPost(paths.addProduct, newProduct).then(r => {
                if (r.status === 201 && r.data) {
                    window.location.reload()
                    toast.success('Product added')
                } else {
                    toast.error("Something went wrong")
                }
            }
        )
    }


    function changeExistsStatus(id, active) {
        requestPost(paths.changeExistsStatus + id, {active: active})
            .then(r => {
                window.location.reload()
            })
    }

    return (
        <div className={'mt-3'}>
            <Row>
                <Col>
                    <h3>Product List</h3>
                </Col>
                <Col>
                    <Button size={'sm'} color={'info'} className={'text-white'} onClick={toggle}>Add Product</Button>
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
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {product.map(((product, index) =>
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>${product.price}</td>
                            <td>{product.category}</td>
                            <td><Button size={'sm'} onClick={() => photoToggle(product.attachment.id)}
                                        className={'text-white'} color={'warning'}>View</Button></td>
                            <td><Input type={'checkbox'} checked={product.exists}
                                       onChange={() => changeExistsStatus(product.id, !product.exists)}

                            /></td>
                        </tr>
                ))}
                </tbody>
            </Table>

            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader close={closeBtn}>
                    <h6>Add Product</h6>
                </ModalHeader>
                <Form>
                    <ModalBody>
                        <FormGroup>
                            <Label for={'name'}>Name</Label>
                            <Input bsSize={'sm'} id={'name'} name={'name'} required onChange={onChange}/>
                            <Feedback>Name should not ne empty</Feedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for={'desc'}>Description</Label>
                            <Input bsSize={'sm'} name={'description'} id={'desc'} required onChange={onChange}/>
                            <Feedback>Description should not ne empty</Feedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for={'photo'}>Photo</Label> <br/>
                            <Input bsSize={'sm'}
                                   onChange={(e) => uploadPhoto(e)}
                                   type={"file"}
                                   required/>
                        </FormGroup>
                        <FormGroup>
                            <Label for={'price'}>Price</Label>
                            <Input bsSize={"sm"} name={'price'} id={'price'} type={'number'} required
                                   onChange={onChange}/>
                            <Feedback>Price should not ne empty</Feedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for={'category'}>Category</Label>
                            <Input defaultValue={'MEAT'}
                                   bsSize={'sm'}
                                   name={'productCategory'}
                                   type={'select'}
                                   id={'category'} required
                                   onChange={onChange}>
                                {category.map((val, index) =>
                                    <option value={val} key={index}>{val}</option>)}
                            </Input>
                            <Feedback>Category should not be empty</Feedback>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" size={'sm'} onClick={addProduct}>Submit</Button>
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

export default Products
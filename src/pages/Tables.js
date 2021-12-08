import {useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import { requestGet, requestPost, requestPut} from "../utils/Requests";
import {paths} from "../paths/paths";
import {TOKEN} from "../utils/constants";
import {GlobalContext} from "../App";
import {Button, Col, Form, FormGroup, Input, Label, Modal, Row, Table} from "reactstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import {ModalBody, ModalFooter} from "react-bootstrap";
import {toast} from "react-toastify";

function Tables({history}) {

    const value = useContext(GlobalContext);
    let params = useParams();
    const [user, setUser] = useState({})
    const [tables, setTables] = useState([])
    const [modal, setModal] = useState(false);
    const [restaurants, setRestaurants] = useState([])
    const [currentResName, setCurrentResName] = useState('')
    const [newTable, setNewTable] = useState({
        restaurantId: parseInt(params.res_id),
        capacity: 0,
        reserved: true,
        price: 0
    })

    const onTableChange = (e) => {
        const {name, value} = e.target

        setNewTable(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }


    async function getUser() {
        return await requestGet(paths.authToken);
    }

    async function getTables(id) {
        return await requestGet(paths.getTables + id).then(res => {
                setTables(res.data.object)
            }
        );
    }

    function getRestaurantName(id) {
        let find = restaurants.find(e => e.id === id);
        setCurrentResName(find.name)
    }

    async function getRestaurants() {
        return await requestGet(paths.getRestaurants).then(res => {
                setRestaurants(res.data.object)
            }
        );
    }

    const toggle = (e) => {
        setModal(!modal);
        getRestaurantName(parseInt(params.res_id))
    }
    const closeBtn = <button className="close" onClick={toggle}>&times;</button>;

    function addTable() {
        requestPost(paths.setTable, newTable).then(res => {
            if (res.status === 201 && res.data) {
                toast.success("Table added")
                window.location.reload()
            } else {
                toast.error("Something went wrong")
            }
        })
    }

    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            getUser().then(res => {
                if (res?.data && res?.status === 200) {
                    setUser(res.data.object)
                    value.setLogged(true);
                    value.setUser(res.data.result);
                    getTables(params.res_id).then()
                    getRestaurants().then()
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

    function deleteTable(id, active) {
        requestPut(paths.editTable + id, {active: active}).then(r => {
            window.location.reload()
        })
    }

    return (
        <div>
            <Row className={'mt-5'}>
                <Col><h3>Tables</h3></Col>
                <Col><Button size={'sm'} color={'success'} onClick={toggle}>Add Table</Button></Col>
            </Row>
            <Table striped bordered hover className={'text-center'}>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th>Price</th>
                    <th>Active</th>
                </tr>
                </thead>
                <tbody>
                {tables.map(((result, index) =>
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{result.capacity} people</td>
                            <td>{result.available ? 'Available' : 'Not Available'}</td>
                            <td>${result.price}</td>
                            <td><Input onChange={() => deleteTable(result.id, !result.active)} checked={result.active}
                                       type={'checkbox'}/></td>
                        </tr>
                ))}
                </tbody>
            </Table>

            <Modal isOpen={modal} toggle={() => toggle()}>
                <ModalHeader close={closeBtn}>Modal title</ModalHeader>
                <Form>
                    <ModalBody>
                        <FormGroup>
                            <Label for="exampleDate">Restaurant</Label>
                            <Input
                                onChange={onTableChange}
                                name="restaurantId"
                                id="exampleDate"
                                required disabled
                                value={currentResName}/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="capacity">Capacity</Label>
                            <Input
                                onChange={onTableChange}
                                type="number"
                                name="capacity"
                                id="capacity"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="price">Price</Label>
                            <Input
                                onChange={onTableChange}
                                type="number"
                                name="price"
                                id="price"
                            />
                        </FormGroup>

                    </ModalBody>
                    <ModalFooter>
                        <Button size={'sm'} color="primary" onClick={addTable}>Submit</Button>
                        <Button size={'sm'} color="secondary" onClick={toggle}>Cancel</Button>
                    </ModalFooter>
                </Form>
            </Modal>


        </div>
    )

}

export default Tables
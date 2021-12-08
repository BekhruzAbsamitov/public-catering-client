import {Button, Card, CardBody, CardHeader, Form, FormGroup, Input, Label} from "reactstrap";
import Feedback from "react-bootstrap/Feedback";
import {paths} from "../paths/paths";
import {useState} from "react";
import {requestPost} from "../utils/Requests";
import {toast} from "react-toastify";

function Register({history}) {

    const [user, setUser] = useState({
        cardNumber: '',
        password: '',
        role: 'ROLE_USER'
    });

    const onChange = (e) => {
        const {name, value} = e.target
        setUser(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleSubmit = () => {
        requestPost(paths.register, user)
            .then(res => {
                if (res.status === 200 && res.data) {
                    history.push("/login")
                }
            }).catch(() => {
            toast("No such citizen exists")
        });
    }


    return (
        <div className={'col-6 offset-3'}>
            <Card className={'mt-5'}>
                <CardHeader>
                    <h3 className={'text-center mb-2'}>Register</h3>
                </CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="username">Card Number</Label>
                            <Input name="cardNumber"
                                   onChange={onChange} id="username" required/>
                            <Feedback>Username must not be empty!</Feedback>
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input name="password" onChange={onChange}
                                   id="password" type="password" required/>
                            <Feedback>Password must not be empty!</Feedback>
                        </FormGroup>
                        <FormGroup>
                            <div className={'d-flex justify-content-center align-items-center my-3'}>
                                <Button color="info" onClick={handleSubmit}>Submit</Button>
                            </div>
                        </FormGroup>
                    </Form>
                </CardBody>
            </Card>
        </div>
    )
}

export default Register
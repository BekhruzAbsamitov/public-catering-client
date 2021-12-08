import {Button, Label, FormGroup, Form, Input} from 'reactstrap'
import {postRequestWithoutToken} from "../utils/Requests";
import {paths} from "../paths/paths";
import {TOKEN, TOKEN_TYPE} from "../utils/constants";
import Feedback from "react-bootstrap/Feedback";
import {useState} from "react";
import {toast} from "react-toastify";
import jwtDecode from "jwt-decode";
import {Link, Redirect} from "react-router-dom";

function Login({history}) {


    const [cardNumber, setCardNumber] = useState('');
    const [password, setPassword] = useState('');
    console.log(history.location.hash)
    if (history.location.hash){
        if (history.location.hash.includes('#!/login')) {
            return <Redirect push to='/login'/>
        }
    }

    /*    browserHistory.listen(location => {
            console.log('here')
            const path = (/#!(\/.*)$/.exec(location.hash) || [])[1];
            if (path) {
                console.log('here')
                history.replace(path);
            }
        })*/
    // const path = props.history.location
    //
    // const checkPath = () => {
    //     if (path.hash) {
    //         if (path.hash.includes('#!/About')) {
    //             return <Redirect push to='/Login'/>
    //         }
    //     }
    // }

    const loginDTO = {
        cardNumber: cardNumber,
        password: password
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        postRequestWithoutToken(paths.login, loginDTO)
            .then(res => {
                if (res.status === 200 && res.data) {
                    localStorage.setItem(TOKEN, TOKEN_TYPE + res.data.object);
                    const decodedToken = jwtDecode(TOKEN_TYPE + res.data.object)
                    if (decodedToken.roles[0].roleName === 'ROLE_ADMIN') {
                        history.push("/admin-main")
                        toast.success("Successfully logged")
                    } else {
                        history.push('/admin-main')
                        toast.success("Successfully logged")
                    }
                }
            }).catch(() => {
            toast.error("Username or password incorrect")
        });
    }

    /*    const userToken = localStorage.getItem('sm-token')
        const decoded = jwtDecode(userToken)
        console.log(decoded, 'decoded')*/

    return <div className='row d-flex align-items-center justify-content-center mt-5'>
        <div className={'col-md-4 my-5'}>
            <h3 className={'text-center mt-5 mb-2'}>Login</h3>
            <Form>
                <FormGroup>
                    <Label for="cardNumber">Username</Label>
                    <Input name="cardNumber"
                           onChange={(e) => setCardNumber(e.target.value)}
                           id="cardNumber" required/>
                    <Feedback>Username must not be empty!</Feedback>
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input name="password"
                           onChange={(e) => setPassword(e.target.value)}
                           id="password" type="password" required/>
                    <Feedback>Password must not be empty!</Feedback>
                </FormGroup>
                <FormGroup>
                    <div className={'d-flex justify-content-center align-items-center my-3'}>
                        <Button size={'sm'} color="info" className={'text-white m-2'}
                                onClick={handleSubmit}>Submit</Button>
                        <Link className={'text-white btn btn-sm btn-success'}
                              to={'/register'}>Register</Link>
                    </div>
                </FormGroup>
            </Form>
        </div>
    </div>
}

export default Login;
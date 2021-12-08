import {useContext, useEffect, useState} from "react";
import {GlobalContext} from "../App";
import {requestGet} from "../utils/Requests";
import {TOKEN} from "../utils/constants";
import {Button} from "reactstrap";
import {Link} from "react-router-dom";

function Home() {

    const value = useContext(GlobalContext);
    const [user, setUser] = useState();

    async function getUser() {
        return await requestGet("auth/me");
    }

    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            getUser().then(res => {
                if (res.data && res.status === 200) {
                    value.setLogged(true);
                    value.setUser(res.data.result);
                    setUser(res.data.object)
                }
            }).catch(() => {
                localStorage.removeItem(TOKEN);
                value.setLogged(false);
                value.setUser('');
            })
        } else {
            value.setLogged(false);
            value.setUser('');
        }
    }, [value])

    return (
        <div>
            <div className="container text-center">
                <h2 className={'mt-5'}>Public Catering</h2>
                <Link className={'text-white text-decoration-none btn btn-success'} to={'/login'}>Login</Link>
                <Link className={'text-white text-decoration-none btn btn-success m-2'}
                      to={'/register'}>Register</Link>
            </div>
        </div>
    )

}

export default Home
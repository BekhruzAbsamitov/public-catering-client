import {GlobalContext} from "../App";
import {requestGet} from "../utils/Requests";
import {TOKEN} from "../utils/constants";

const {useContext, useEffect} = require("react");

function Main({history}) {
    const value = useContext(GlobalContext);

    async function getUser() {
        return await requestGet("auth/me");
    }

    useEffect(() => {
        getUser().then(res => {
            if (res.data && res.status === 200) {
                value.setLogged(true);
                value.setUser(res.data.result);
                history.push("/main")
            }
        }).catch(() => {
            localStorage.removeItem(TOKEN);
            value.setLogged(false);
            value.setUser('');
            history.push("/")
        })
    }, [history, value])

    return (
        <div>
            
        </div>
    )
}

export default Main
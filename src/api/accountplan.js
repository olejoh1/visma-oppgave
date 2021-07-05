import axios from 'axios';

const accountplanApi = axios.create({
    baseURL: "https://raw.githubusercontent.com/olejoh1/jobbOppgaveVisma/master/data/accountplangenericformat.json?token=AACLM6XHDSLIQO6WZL5CNTDA5MKWO",
    method: "get",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
})

export default accountplanApi
import axios from 'axios';

//Henter dataene fra json-filen som ligger på github, som om det skulle ha vært et api
const balanceApi = axios.create({
    baseURL: "https://raw.githubusercontent.com/olejoh1/jobbOppgaveVisma/master/data/Trialbalancesgenericformat.json?token=AACLM6UGRWKYQAIUHVRDLLDA5MK64",
    method: "get",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
})

export default balanceApi
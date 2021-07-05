import './App.css';
import Account from './Components/Account';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import _ from 'lodash';
import balanceApi from './api/balance';
import accountplanApi from './api/accountplan';

function App() {
	//Lager array elementer som skal holde på dataene etter de blir filtrert og hentet fra api
	const [accountList, setAccountList] = useState([])
	const [accountsFromApi, setAccountsFromApi] = useState([])
	const [balancesFromApi, setBalancesFromApi] = useState([])
	const [periods, setPeriods] = useState(new Set())

	//Filtrerer dataene fra balance api, slik at alle kontoene inne holder hvilken periode de tilhører
	//Den henter perioden og året som hører til det arrayet den holder på med
	const flattenBalances = (balances) => {
			let flattenedList = []
			for (let balancesForAPeriod of balances) {
				let period = balancesForAPeriod.Year + "/" + balancesForAPeriod.Period
				for (let balance of balancesForAPeriod.Balances) {
					flattenedList.push(
						{
							"AccNo": balance.AccNo,
							"Balance": balance.Balance,
							"Period": period
						}
					)
				}
			}
			return flattenedList
		}

	//Funktionen slår sammen de to filtrerte datastrømmene
  	const joinAccountsAndBalances = (accounts, balances) => {
		let joinedList = []
		//Starter løkke for kontoene
		for (var account of accounts) {
			for (let period of periods) {
				//Finner kontosaldoer i balances for alle perioder - skal være null eller 1, men bare i tilfelle kjører vi en løkke
				const balancesForAccount = balances.filter(balance => balance.AccNo === account.AccNo && balance.Period === period)
				//Ser om den fant registrerte saldoer for kontoen i den perioden
				if (balancesForAccount.length > 0) {
					//Legger inn saldoen for perioden
					for (let balance of balancesForAccount) {
						joinedList.push(
							{
								"account_number": account.AccNo,
								"description": account.Description,
								"period": balance.Period,
								"balance": balance.Balance
							}
						)
					}
				} else {
					//Ingen saldo for perioden
					joinedList.push(
						{
							"account_number": account.AccNo,
							"description": account.Description,
							"period": period,
							"balance": "-"
						}
					)
				}
			}
		}
		return joinedList
	}

	//Funktionen henter ut periodene og årene fra dataene og lagrer perioden og året den hører til sammen i et array
  	const getPeriodsFromBalances = (balances) => {
		let foundPeriods = new Set()
		for (let balancesForAPeriod of balances) {
			let period = balancesForAPeriod.Year + "/" + balancesForAPeriod.Period
			foundPeriods.add(period)
		}
		return foundPeriods
	}

	//Funktionen starter opp btggingen av de forskjellige arrayene med data
	const buildTableData = () => {
		//Starter å hente periodene og årene
		setPeriods(getPeriodsFromBalances(balancesFromApi))
		//Starter prosessen med å koble sammen kontoene med beløpene som er registrert på seg
		const mergedAccountsAndBalances = joinAccountsAndBalances(
			_.get(accountsFromApi, "Accounts", []),
			flattenBalances(balancesFromApi)
		)
		setAccountList(mergedAccountsAndBalances)
	} 

	//Funktionen henter dataene fra apiene
	const getAccounList = async () => {
		//Den spør begge apiene om å få dataene, og venter til den har fått svar fra begge at de er ferdige
		axios.all([balanceApi.get(), accountplanApi.get()]).then(axios.spread((...responses) => {
			setBalancesFromApi(responses[0].data)
			setAccountsFromApi(responses[1].data)
		}))
		//Fanger opp feilmeldinger om den får noen, og viser feilmeldingen i konsolen
		.catch(errors => {
			console.error("Error fetching accounts and balances")
		})
	}

	//Funktionen blir kalt når DOM sier at det er en endring
	//Denne kjører funktionen for å hente data på nytt igjen
	useEffect(() => {
		getAccounList();
	}, [])

	//Funktionen blir kalt når DOM sier at det er en endring
	//Denne kjører byggingen av arraylistene med data på nytt igjen
	useEffect(() => {
		buildTableData();
	}, [balancesFromApi, accountsFromApi])

	//HTML elementene som eksisterer på siden
  	return (
		<div className="App">
		<div id="container">
			<nav id="nav">
				<img src="vismalogowhite.svg" width="132" alt="Visma.no"/>
				<h2>Placeholder for Navigation</h2>
			</nav>
			<header id="header">
				<h1 id="header_title">Kontoadministrasjon</h1>
			</header>
			<main id="main">
				<h3 class="main_title">Kontosaldo</h3>
				<Account accounts = {accountList}></Account>
			</main>
			<footer id="footer">
				<p>&copy; Visma Software As</p>
			</footer>
		</div>
		</div>
	);
}

export default App;

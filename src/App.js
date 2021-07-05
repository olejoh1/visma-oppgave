import './App.css';
import Account from './Components/Account';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import _ from 'lodash';
import balanceApi from './api/balance';
import accountplanApi from './api/accountplan';

function App() {
	const [accountList, setAccountList] = useState([])
	const [accountsFromApi, setAccountsFromApi] = useState([])
	const [balancesFromApi, setBalancesFromApi] = useState([])
	const [periods, setPeriods] = useState(new Set())

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

  const joinAccountsAndBalances = (accounts, balances) => {
		let joinedList = []
		for (var account of accounts) {
			for (let period of periods) {
				// find account balances in balances for all periods - should be zero or 1, but just in case we do a loop
				const balancesForAccount = balances.filter(balance => balance.AccNo === account.AccNo && balance.Period === period)
				if (balancesForAccount.length > 0) {
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
					// no balance for the period
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

  const getPeriodsFromBalances = (balances) => {
		let foundPeriods = new Set()
		for (let balancesForAPeriod of balances) {
			let period = balancesForAPeriod.Year + "/" + balancesForAPeriod.Period
			foundPeriods.add(period)
		}
		return foundPeriods
	}

	const buildTableData = () => {
		setPeriods(getPeriodsFromBalances(balancesFromApi))

		const mergedAccountsAndBalances = joinAccountsAndBalances(
			_.get(accountsFromApi, "Accounts", []),
			flattenBalances(balancesFromApi)
		)
		setAccountList(mergedAccountsAndBalances)
	} 

	const getAccounList = async () => {
		axios.all([balanceApi.get(), accountplanApi.get()]).then(axios.spread((...responses) => {
			setBalancesFromApi(responses[0].data)
			setAccountsFromApi(responses[1].data)
		})).catch(errors => {
			console.error("Error fetching accounts and balances")
		})
	}

	useEffect(() => {
		getAccounList();
	}, [])

	useEffect(() => {
		buildTableData();
	}, [balancesFromApi, accountsFromApi])

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

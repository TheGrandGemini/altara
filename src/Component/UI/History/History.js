import React, { useContext, useState, useEffect, useCallback } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import style from './History.module.css';
import WalletContext from '../../../Store/wallet-context';

const CHAIN_ID = 1;

const TransactionHistory = () => {
	const [transactions, setTransactions] = useState([]);
	const [loading, setloading] = useState(false);
	const [error, setError] = useState(null);

	const { wallet } = useContext(WalletContext);

	const fetchTransactions = useCallback(async () => {
		setloading(true);
		setError(null);

		const client = new GoldRushClient(process.env.REACT_APP_COVALENT_API_KEY);

		try {
			const allTxs = [];

			const response =
				await client.TransactionService.getAllTransactionsForAddressByPage(
					CHAIN_ID,
					wallet,
					20
				);
			console.log(response);
		} catch (err) {
			console.error('Error fetching transactions:', err);
			setError(err.message || 'Failed to fetch transaction history');
		} finally {
			setloading(false);
		}
	}, [wallet]);

	useEffect(() => {
		if (!wallet) {
			return;
		} else {
			fetchTransactions();
		}
	}, [wallet, fetchTransactions]);

	return <section className={style.history}></section>;
};

export default TransactionHistory;

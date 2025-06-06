import { useEffect, useReducer } from 'react';
import style from './History.module.css';
import HistoryTable from './HistoryTable';
import HistoryModal from './HistoryModal';
import useFetchTransactions from '../../hooks/useTransactions';

const PAGE_SIZE = 20;

const initialState = {
	transactions: [],
	loading: false,
	error: null,
	page: 0,
	hoveredTx: null,
};

function reducer(state, action) {
	switch (action.type) {
		case 'FETCH_START':
			return { ...state, loading: true, error: null };
		case 'FETCH_SUCCESS':
			return { ...state, loading: false, transactions: action.payload };
		case 'FETCH_ERROR':
			return { ...state, loading: false, error: action.payload };
		case 'SET_PAGE':
			return { ...state, page: action.payload };
		case 'SET_HOVERED':
			return { ...state, hoveredTx: action.payload };
		default:
			return state;
	}
}

const TransactionHistory = ({ address }) => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { transactions, loading, error, page, hoveredTx } = state;
	const fetchTransactions = useFetchTransactions(address);

	useEffect(() => {
		dispatch({ type: 'FETCH_START' });
		fetchTransactions()
			.then((txs) => dispatch({ type: 'FETCH_SUCCESS', payload: txs }))
			.catch((err) =>
				dispatch({
					type: 'FETCH_ERROR',
					payload: err?.message || 'Failed to fetch transactions',
				})
			);
	}, [fetchTransactions]);

	const paginatedTxs = transactions.slice(
		page * PAGE_SIZE,
		page * PAGE_SIZE + PAGE_SIZE
	);

	return (
		<section className={style.history}>
			<HistoryTable
				loading={loading}
				error={error}
				paginatedTxs={paginatedTxs}
				page={page}
				PAGE_SIZE={PAGE_SIZE}
				transactions={transactions}
				onPageChange={(p) => dispatch({ type: 'SET_PAGE', payload: p })}
				onRowHover={(tx) => dispatch({ type: 'SET_HOVERED', payload: tx })}
				onRowLeave={() => dispatch({ type: 'SET_HOVERED', payload: null })}
				onRowClick={(tx) => window.open(tx.explorer, '_blank')}
			/>
			<HistoryModal tx={hoveredTx} />
		</section>
	);
};

export default TransactionHistory;

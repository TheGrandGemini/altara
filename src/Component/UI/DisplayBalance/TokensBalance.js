import { useState, useEffect, useReducer } from 'react';
import style from './TokensBalance.module.css';
import WalletInfo from './WalletInfo';
import TokensTable from './TokensTable';
import BalanceSkeleton from '../BalanceSkeleton';
import useFetchBalances from '../../hooks/useFetchBalances';

const initialState = {
	tokens: [],
	loading: true,
	error: '',
	totalBalance: 0,
};

function reducer(state, action) {
	switch (action.type) {
		case 'FETCH_START':
			return { ...state, loading: true, error: '' };
		case 'FETCH_SUCCESS':
			return {
				...state,
				loading: false,
				tokens: action.tokens,
				totalBalance: action.totalBalance,
			};
		case 'FETCH_ERROR':
			return { ...state, loading: false, error: action.error };
		default:
			return state;
	}
}

const TokensBalance = ({ address }) => {
	const [copied, setCopied] = useState(false);
	const [state, dispatch] = useReducer(reducer, initialState);
	const fetchBalances = useFetchBalances(address);

	useEffect(() => {
		const fetchData = async () => {
			dispatch({ type: 'FETCH_START' });
			const { tokens, totalBalance, error } = await fetchBalances();
			if (error) {
				dispatch({ type: 'FETCH_ERROR', error });
			} else {
				dispatch({
					type: 'FETCH_SUCCESS',
					tokens,
					totalBalance,
				});
			}
		};
		fetchData();
	}, [fetchBalances]);

	const handleCopy = () => {
		navigator.clipboard.writeText(address);
		setCopied(true);
		setTimeout(() => setCopied(false), 1200);
	};

	return (
		<section
			className={style.tokens}
			id='balance'>
			<WalletInfo
				address={address}
				copied={copied}
				handleCopy={handleCopy}
				totalBalance={state.totalBalance}
				style={style}
			/>
			{state.loading ? (
				<BalanceSkeleton />
			) : (
				<TokensTable
					tokens={state.tokens}
					loading={state.loading}
					error={state.error}
					onRetry={fetchBalances}
				/>
			)}
		</section>
	);
};

export default TokensBalance;

import { useState, useEffect, useCallback, useReducer } from 'react';
import style from './TokensBalance.module.css';
import WalletInfo from './WalletInfo';
import TokensTable from './TokensTable';
import { formatNumber } from '../../Utilities/formatFtn';
import BalanceSkeleton from '../BalanceSkeleton';

const supportedChains = [
	{ name: 'Ethereum', chain: 'eth' },
	{ name: 'BNB', chain: 'bsc' },
	{ name: 'Polygon', chain: 'polygon' },
	{ name: 'Avalanche', chain: 'avalanche' },
	{ name: 'Fantom', chain: 'fantom' },
	{ name: 'Arbitrum', chain: 'arbitrum' },
	{ name: 'Optimism', chain: 'optimism' },
];

const apiKey = process.env.REACT_APP_MORALIS_API_KEY;

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

	const calculateTotalBalance = (tokens) => {
		const total = tokens.reduce((acc, token) => acc + token.value, 0);
		return `$${formatNumber(total)}`;
	};

	const fetchBalances = useCallback(async () => {
		dispatch({ type: 'FETCH_START' });

		const results = await Promise.allSettled(
			supportedChains.map(async (chain) => {
				try {
					const res = await fetch(
						`https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens?chain=${chain.chain}`,
						{ headers: { 'X-API-Key': apiKey } }
					);
					if (!res.ok)
						throw new Error(`Error fetching ${chain.name} (${chain.chain})`);
					const data = await res.json();
					return { chain: chain.name, result: data.result || [] };
				} catch (err) {
					return { chain: chain.name, result: [], error: err.message };
				}
			})
		);

		const allTokens = results
			.filter((r) => r.status === 'fulfilled')
			.map((r) => r.value);

		const errors = allTokens
			.filter((entry) => entry.error)
			.map((entry) => `${entry.chain}: ${entry.error}`);

		const filteredTokens = allTokens
			.flatMap(
				(obj) => obj.result.map((t) => ({ ...t, chain: obj.chain })) || []
			)
			.filter(
				(token) =>
					Number(token.balance) > 0 &&
					token.possible_spam === false &&
					token.usd_price > 0
			)
			.map((token) => ({
				name: token.name,
				ticker: token.symbol,
				balance: token.balance_formatted,
				price: token.usd_price || 0,
				change: token.usd_price_24hr_percent_change,
				logo: token.logo || '',
				value: token.usd_value,
				chain: token.chain,
			}))
			.sort((a, b) => b.value - a.value);

		dispatch({
			type: 'FETCH_SUCCESS',
			tokens: filteredTokens,
			totalBalance: calculateTotalBalance(filteredTokens),
		});

		if (errors.length) {
			dispatch({
				type: 'FETCH_ERROR',
				error: errors.join(' | '),
			});
		}
	}, [address]);

	useEffect(() => {
		fetchBalances();
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

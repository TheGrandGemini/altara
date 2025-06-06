import { useCallback } from 'react';
import { formatNumber } from '../../Component/Utilities/formatFtn';

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

export default function useFetchBalances(address) {
	const calculateTotalBalance = (tokens) => {
		const total = tokens.reduce((acc, token) => acc + token.value, 0);
		return `$${formatNumber(total)}`;
	};

	return useCallback(async () => {
		const results = await Promise.allSettled(
			supportedChains.map(async (chain) => {
				try {
					const res = await fetch(
						`https://deep-index.moralis.io/api/v2.2/wallets/${address}/tokens?chain=${chain.chain}`,
						{ headers: { 'X-API-Key': apiKey } }
					);
					if (!res.ok) {
						const errorText = await res.text();
						console.log(errorText);
						throw new Error(`Error fetching ${chain.name} (${chain.chain})`);
					}

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

		return {
			tokens: filteredTokens,
			totalBalance: calculateTotalBalance(filteredTokens),
			error: errors.length ? errors.join(' | ') : '',
		};
	}, [address]);
}

import React, { useContext, useState, useEffect, useCallback } from 'react';
import style from './Tokens.module.css';
import { GoldRushClient } from '@covalenthq/client-sdk';
import WalletContext from '../../../Store/wallet-context';
import {
	formatBalance,
	formatNumber,
	formatWalletAddress,
} from '../../Utilities/formatFtn';
import BN from 'bn.js';

const evmChains = [
	{ name: 'Ethereum', chainId: 'eth-mainnet' },
	{ name: 'Polygon', chainId: 'matic-mainnet' },
	{ name: 'Binance Smart Chain', chainId: 'bsc-mainnet' },
	{ name: 'Arbitrum', chainId: 'arbitrum-mainnet' },
	{ name: 'Optimism', chainId: 'optimism-mainnet' },
	{ name: 'Base', chainId: 'base-mainnet' },
	{ name: 'Fantom', chainId: 'fantom-mainnet' },
];

const Tokens = () => {
	const { wallet } = useContext(WalletContext);
	const [tokens, setTokens] = useState([]);
	const [totalBalance, setTotalBalance] = useState(0);

	// Fetch token balances
	const fetchTokenBalances = useCallback(async (wallet) => {
		const client = new GoldRushClient('cqt_rQ3qrJw7T8PX4bTCjbrPmMQK8WtF');

		try {
			const allTokens = [];

			for (const chain of evmChains) {
				const response =
					await client.BalanceService.getTokenBalancesForWalletAddress(
						chain.chainId,
						wallet
					);

				if (!response.error) {
					const chainTokens = response.data.items
						.map((token) => mapTokenData(token))
						.filter(
							(token) => token !== null && token.price > 0 && token.balance > 0
						); // Remove tokens with balance <= 0

					allTokens.push(...chainTokens);
					console.log(chainTokens);
				} else {
					console.error(
						`Error fetching tokens for ${chain.name}:`,
						response.error_message
					);
				}
			}

			// Sort tokens in descending order by value
			const sortedTokens = allTokens.sort((a, b) => b.value - a.value);

			setTokens(sortedTokens);
			calculateTotalBalance(sortedTokens);
		} catch (error) {
			console.error('Error fetching token balances:', error);
		}
	}, []);

	// Map token data
	const mapTokenData = (token) => {
		const rawBalance = new BN(token.balance);
		const decimals = token.contract_decimals;

		const formattedBalance = formatBalance(rawBalance, decimals);

		if (!token.is_spam) {
			const value = parseFloat(formattedBalance) * (token.quote_rate || 0);
			return {
				name: token.contract_name,
				ticker: token.contract_ticker_symbol,
				balance: parseFloat(formattedBalance),
				price: token.quote_rate || 0,
				change:
					((token.quote_rate - token.quote_rate_24h) / token.quote_rate_24h) *
					100,
				logo: token.logo_url || '',
				value,
			};
		}
		return null;
	};

	// Calculate total balance
	const calculateTotalBalance = (tokens) => {
		const total = tokens.reduce(
			(acc, token) => acc + token.balance * token.price,
			0
		);
		setTotalBalance(`$${formatNumber(total)}`);
	};

	// Fetch tokens when wallet changes
	useEffect(() => {
		if (wallet) {
			fetchTokenBalances(wallet);
		}
	}, [wallet, fetchTokenBalances]);

	return (
		<section
			className={style.tokens}
			id='balance'>
			<div className={style.walletInfo}>
				<p className={style.add}>Wallet: {formatWalletAddress(wallet)}</p>
				<p>Total Balance: {totalBalance}</p>
			</div>

			<table className={style.tokenTable}>
				<thead>
					<tr>
						<th>Token</th>
						<th>Price</th>
						<th>Amount</th>
						<th>Value</th>
					</tr>
				</thead>
				<tbody>
					{tokens.length > 0 ? (
						tokens.map((token, index) => (
							<tr key={index}>
								<td>
									<div className={style.tokenInfo}>
										<img
											src={token.logo}
											alt={token.name}
											className={style.tokenLogo}
										/>
										<div>
											<p>{`${token.name} (${token.ticker})`}</p>
										</div>
									</div>
								</td>
								<td>
									${formatNumber(token.price)}
									<span
										className={
											token.change >= 0
												? style.positiveChange
												: style.negativeChange
										}>
										({token.change >= 0 ? '+' : ''}
										{token.change.toFixed(2)}%)
									</span>
								</td>
								<td>{formatNumber(token.balance)}</td>
								<td>${formatNumber(token.value)}</td>
							</tr>
						))
					) : (
						<tr>
							<td
								colSpan='4'
								style={{ textAlign: 'center' }}>
								No tokens available
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</section>
	);
};

export default Tokens;

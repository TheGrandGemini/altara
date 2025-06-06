import React from 'react';
import style from './TokensBalance.module.css';
import { formatNumber } from '../../Utilities/formatFtn';

const TokensTable = ({ tokens, loading, error, onRetry }) => {
	let tableContent;
	if (loading) {
		tableContent = (
			<tr>
				<td
					colSpan='4'
					style={{ textAlign: 'center' }}>
					Loading...
				</td>
			</tr>
		);
	} else if (error) {
		tableContent = (
			<tr>
				<td
					colSpan='5'
					style={{ textAlign: 'center', color: 'red', padding: '24px 0' }}>
					<span
						role='img'
						aria-label='error'
						style={{ fontSize: 24 }}>
						⚠️
					</span>
					<br />
					<b>Failed to fetch tokens.</b>
					<br />
					<button
						style={{
							marginTop: 10,
							padding: '6px 18px',
							background: '#344e41',
							color: '#fff',
							border: 'none',
							borderRadius: 4,
							cursor: 'pointer',
							fontSize: 14,
						}}
						onClick={onRetry}>
						Retry
					</button>
				</td>
			</tr>
		);
	} else if (tokens.length === 0) {
		tableContent = (
			<tr>
				<td
					colSpan='5'
					style={{ textAlign: 'center' }}>
					No tokens available
				</td>
			</tr>
		);
	} else {
		tableContent = tokens.map((token, index) => (
			<tr key={index}>
				<td data-label='Chain'>{token.chain}</td>
				<td data-label='Name'>
					<div className={style.tokenInfo}>
						{token.logo ? (
							<img
								src={token.logo}
								alt={token.name}
								className={style.tokenLogo}
								onError={(e) => {
									e.target.onerror = null;
									e.target.src = '/assets/fallback-token.png';
								}}
							/>
						) : (
							<span
								className={style.tokenLogo}
								style={{ fontSize: 24 }}>
								🪙
							</span>
						)}
						<div>
							<p>{`${token.name} (${token.ticker})`}</p>
						</div>
					</div>
				</td>
				<td data-label='Price'>
					${formatNumber(token.price)}
					<span
						className={
							token.change >= 0 ? style.positiveChange : style.negativeChange
						}>
						&nbsp;({token.change > 0 ? '+' : '-'}
						{Math.abs(token.change).toFixed(2)}%)
					</span>
				</td>
				<td data-label='Amount'>{formatNumber(token.balance)}</td>
				<td data-label='Value'>${formatNumber(token.value)}</td>
			</tr>
		));
	}

	return (
		<table className={style.tokenTable}>
			<thead>
				<tr>
					<th>Chain</th>
					<th>Token</th>
					<th>Price</th>
					<th>Amount</th>
					<th>Value</th>
				</tr>
			</thead>
			<tbody>{tableContent}</tbody>
		</table>
	);
};

export default TokensTable;

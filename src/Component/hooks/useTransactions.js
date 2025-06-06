import { useCallback } from 'react';

const apiKey = process.env.REACT_APP_COVALENT_API_KEY;

const supportedChains = [
	{ name: 'Ethereum', id: 1 },
	{ name: 'BNB', id: 56 },
	{ name: 'Polygon', id: 137 },
	{ name: 'Avalanche', id: 43114 },
	{ name: 'Fantom', id: 250 },
	{ name: 'Arbitrum', id: 42161 },
];

export default function useFetchTransactions(address) {
	return useCallback(async () => {
		const allTxs = await Promise.all(
			supportedChains.map(async ({ id, name }) => {
				const url = `https://api.covalenthq.com/v1/${id}/address/${address}/transactions_v3/?key=${apiKey}`;
				try {
					const res = await fetch(url);
					const data = await res.json();
					if (data.error) {
						console.error(`Error from ${name}: ${data.error_message}`);
						return [];
					}
					return data.data.items.map((tx) => ({ ...tx, chain: name }));
				} catch (err) {
					console.error(`Failed to fetch ${name} txs:`, err.message);
					return [];
				}
			})
		);

		const sortedTxns = allTxs
			.flat()
			.filter(
				(tx) => tx && typeof tx === 'object' && tx.tx_hash && tx.value > 0
			)
			.map((tx) => {
				const lowerAddress = address.toLowerCase();
				const transfers = Array.isArray(tx.log_events)
					? tx.log_events.filter(
							(log) =>
								log.decoded?.name === 'Transfer' &&
								log.decoded.params.some(
									(p) => p.name === 'from' || p.name === 'to'
								)
					  )
					: [];
				const sentLog = transfers.find((log) =>
					log.decoded.params.find(
						(p) => p.name === 'from' && p.value.toLowerCase() === lowerAddress
					)
				);
				const receivedLog = transfers.find((log) =>
					log.decoded.params.find(
						(p) => p.name === 'to' && p.value.toLowerCase() === lowerAddress
					)
				);

				let direction = 'Other';
				if (sentLog && receivedLog) direction = 'Swapped';
				else if (sentLog) direction = 'Sent';
				else if (receivedLog) direction = 'Received';

				const primaryLog = sentLog || receivedLog || transfers[0];

				const getValue = (log) => {
					const val =
						log?.decoded.params.find((p) => p.name === 'value')?.value || 0;
					const decimals = log?.sender_contract_decimals || 18;
					return (Number(val) / 10 ** decimals).toFixed(4);
				};

				const getSymbol = (log) =>
					log?.sender_contract_ticker_symbol || 'Unknown';
				const getToken = (log) => log?.sender_name || 'Unknown';
				const getLogo = (log) => log?.sender_logo_url;

				let value = '';
				let token = '';
				let symbol = '';
				let logo = '';
				if (direction === 'Swapped') {
					const sentValue = getValue(sentLog);
					const sentSymbol = getSymbol(sentLog);
					const recvValue = getValue(receivedLog);
					const recvSymbol = getSymbol(receivedLog);
					value = `Swapped ${sentValue} ${sentSymbol} → ${recvValue} ${recvSymbol}`;
					token = `${getToken(sentLog)} → ${getToken(receivedLog)}`;
					symbol = `${sentSymbol} → ${recvSymbol}`;
					logo = getLogo(receivedLog) || getLogo(sentLog);
				} else {
					value = getValue(primaryLog);
					token = getToken(primaryLog);
					symbol = getSymbol(primaryLog);
					logo = getLogo(primaryLog);
				}

				const from =
					sentLog?.decoded.params.find((p) => p.name === 'from')?.value ||
					tx.from_address ||
					'';
				const to =
					receivedLog?.decoded.params.find((p) => p.name === 'to')?.value ||
					tx.to_address ||
					'';

				const explorer = tx.explorers?.[0]?.url || '';

				return {
					txHash: tx.tx_hash || '',
					timestamp: tx.block_signed_at || '',
					blockNumber: tx.block_height || '',
					chain: tx.chain || '',
					explorer,
					token,
					symbol,
					logo,
					from,
					to,
					direction,
					value,
					gas:
						tx.gas_spent && tx.gas_price
							? ((Number(tx.gas_spent) * Number(tx.gas_price)) / 1e18).toFixed(
									6
							  )
							: '0.000000',
					gasUsd: `$${Number(tx.gas_quote || 0).toFixed(2)}`,
					status: tx.successful ? 'Success' : 'Failed',
				};
			});

		return sortedTxns;
	}, [address]);
}

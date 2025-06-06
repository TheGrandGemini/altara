import style from './History.module.css';

const HistoryTable = ({
	loading,
	error,
	paginatedTxs,
	page,
	PAGE_SIZE,
	transactions,
	onPageChange,
	onRowHover,
	onRowLeave,
	onRowClick,
}) => (
	<>
		{loading ? (
			<table className={style.table}>
				<thead>
					<tr>
						<th>Transaction Hash</th>
						<th>Direction</th>
						<th>Block</th>
						<th>Age</th>
						<th>From</th>
						<th>To</th>
						<th>Amount</th>
						<th>Txn Fee</th>
					</tr>
				</thead>
				<tbody>
					{Array.from({ length: PAGE_SIZE }).map((_, i) => (
						<tr
							key={i}
							className={style.tr}>
							{Array.from({ length: 8 }).map((_, j) => (
								<td key={j}>
									<div className={style.skeleton} />
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		) : error ? (
			<div className={style.error}>{error}</div>
		) : (
			<>
				<table className={style.table}>
					<thead>
						<tr>
							<th>Transaction Hash</th>
							<th>Direction</th>
							<th>Block</th>
							<th>Age</th>
							<th>From</th>
							<th>To</th>
							<th>Amount</th>
							<th>Txn Fee</th>
						</tr>
					</thead>
					<tbody>
						{paginatedTxs.map((tx) => (
							<tr
								key={tx.txHash}
								className={style.tr}
								onMouseEnter={() => onRowHover(tx)}
								onMouseLeave={onRowLeave}
								onClick={() => onRowClick(tx)}
								style={{ cursor: 'pointer' }}>
								<td className={style.hash}>
									{tx.txHash.slice(0, 10)}...{tx.txHash.slice(-6)}
								</td>
								<td>{tx.direction}</td>
								<td>{tx.blockNumber || '-'}</td>
								<td>
									{tx.timestamp
										? (() => {
												const diff = Math.floor(
													(Date.now() - new Date(tx.timestamp)) / 1000
												);
												if (diff < 60) return `${diff}s ago`;
												if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
												if (diff < 86400)
													return `${Math.floor(diff / 3600)}h ago`;
												return `${Math.floor(diff / 86400)}d ago`;
										  })()
										: '-'}
								</td>
								<td>
									{tx.fromName ||
										tx.from?.slice(0, 6) + '...' + tx.from?.slice(-4)}
								</td>
								<td>
									{tx.toName || tx.to?.slice(0, 6) + '...' + tx.to?.slice(-4)}
								</td>
								<td>
									{tx.value} {tx.symbol}
								</td>
								<td>{tx.gasUsd}</td>
							</tr>
						))}
					</tbody>
				</table>
				<div className={style.pagination}>
					<button
						onClick={() => onPageChange(page - 1)}
						disabled={page === 0}>
						Prev
					</button>
					<span>
						Page {page + 1} of {Math.ceil(transactions.length / PAGE_SIZE) || 1}
					</span>
					<button
						onClick={() => onPageChange(page + 1)}
						disabled={(page + 1) * PAGE_SIZE >= transactions.length}>
						Next
					</button>
				</div>
			</>
		)}
	</>
);

export default HistoryTable;

import style from './History.module.css';

const HistoryModal = ({ tx }) => {
	if (!tx) return null;
	return (
		<div className={style.modal}>
			<strong>Transaction Details</strong>
			<div className={style.modalDetails}>
				<span className={style.modalLabel}>Tx Hash:</span>
				<span className={style.modalValue}>{tx.txHash}</span>
				<span className={style.modalLabel}>Direction:</span>
				<span className={style.modalValue}>{tx.direction}</span>
				<span className={style.modalLabel}>Block:</span>
				<span className={style.modalValue}>{tx.blockNumber || '-'}</span>
				<span className={style.modalLabel}>Timestamp:</span>
				<span className={style.modalValue}>
					{new Date(tx.timestamp).toLocaleString()}
				</span>
				<span className={style.modalLabel}>Status:</span>
				<span className={style.modalValue}>{tx.status}</span>
				<span className={style.modalLabel}>From:</span>
				<span className={style.modalValue}>{tx.from}</span>
				<span className={style.modalLabel}>To:</span>
				<span className={style.modalValue}>{tx.to}</span>
				<span className={style.modalLabel}>Value:</span>
				<span className={style.modalValue}>
					{tx.value} {tx.symbol}
				</span>
				<span className={style.modalLabel}>Chain:</span>
				<span className={style.modalValue}>{tx.chain}</span>
				<span className={style.modalLabel}>Txn Fee:</span>
				<span className={style.modalValue}>{tx.gas}</span>
				<span className={style.modalLabel}>Gas (USD):</span>
				<span className={style.modalValue}>{tx.gasUsd}</span>
			</div>
		</div>
	);
};

export default HistoryModal;

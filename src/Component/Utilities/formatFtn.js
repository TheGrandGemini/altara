import BN from 'bn.js';

function formatBalance(balance, decimals) {
	try {
		if (!balance || isNaN(decimals)) {
			throw new Error('Invalid balance or decimals');
		}

		const bigBalance = new BN(balance.toString());
		const divisor = new BN(10).pow(new BN(decimals));

		const whole = bigBalance.div(divisor).toString();
		const fraction = bigBalance.mod(divisor).toString().padStart(decimals, '0');

		const trimmedFraction = fraction.replace(/0+$/, '');

		return trimmedFraction ? `${whole}.${trimmedFraction}` : whole;
	} catch (error) {
		console.error('Error formatting token balance:', error.message);
		return '0';
	}
}

function formatNumber(value) {
	const num = Number(value);
	if (isNaN(num)) return '0.00';

	if (num >= 1_000_000) {
		return `${(num / 1_000_000).toFixed(2)}M`;
	} else if (num >= 1_000) {
		return `${(num / 1_000).toFixed(2)}K`;
	} else {
		return num.toFixed(2);
	}
}

const formatWalletAddress = (address) => {
	if (!address) return '';
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export { formatBalance, formatNumber, formatWalletAddress };

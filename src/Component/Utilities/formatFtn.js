import BN from 'bn.js';

function formatBalance(balance, decimals) {
	try {
		// Validate inputs
		if (!balance || isNaN(decimals)) {
			throw new Error('Invalid balance or decimals');
		}

		// Convert balance to BN
		const bigBalance = new BN(balance.toString());
		const divisor = new BN(10).pow(new BN(decimals));

		// Calculate whole and fractional parts
		const whole = bigBalance.div(divisor).toString();
		const fraction = bigBalance.mod(divisor).toString().padStart(decimals, '0');

		// Trim trailing zeros from the fractional part
		const trimmedFraction = fraction.replace(/0+$/, '');

		// Return formatted balance
		return trimmedFraction ? `${whole}.${trimmedFraction}` : whole;
	} catch (error) {
		console.error('Error formatting token balance:', error.message);
		return '0';
	}
}

function formatNumber(value) {
	if (value >= 1_000_000) {
		return `${(value / 1_000_000).toFixed(1)}M`;
	} else if (value >= 1_000) {
		return `${(value / 1_000).toFixed(1)}K`;
	} else {
		return value.toLocaleString();
	}
}

// Format wallet address
const formatWalletAddress = (address) => {
	if (!address) return '';
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export { formatBalance, formatNumber, formatWalletAddress };

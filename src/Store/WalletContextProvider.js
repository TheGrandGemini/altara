import { useState } from 'react';
import WalletContext from './wallet-context';

const WalletContextProvider = (props) => {
	const [wallet, setWallet] = useState(null);

	const clearWallet = () => {
		setWallet(null);
	};

	const contextValue = {
		wallet: wallet,
		setWallet: setWallet,
		clearWallet: clearWallet,
	};

	return (
		<WalletContext.Provider value={contextValue}>
			{props.children}
		</WalletContext.Provider>
	);
};

export default WalletContextProvider;

import React, { useState, useEffect } from 'react';
import WalletContext from './wallet-context';

const WalletContextProvider = (props) => {
	const [wallet, setWallet] = useState(null);

	// const connectWallet = async () => {
	// 	if (window.ethereum) {
	// 		try {
	// 			const accounts = await window.ethereum.request({
	// 				method: 'eth_requestAccounts',
	// 			});

	// 			setWallet(accounts[0]);
	// 		} catch (error) {
	// 			console.error('User denied wallet connection');
	// 		}
	// 	} else {
	// 		alert('Wallet is not present, Please install one');
	// 	}
	// };

	// const disconnectWallet = () => {
	// 	setWallet(null);
	// };

	// useEffect(() => {
	// 	setWallet(null);
	// }, []);

	const contextValue = {
		wallet: wallet,
		setWallet: setWallet,
		// connectWalletHandler: connectWallet,
		// disconnectWalletHandler: disconnectWallet,
	};

	return (
		<WalletContext.Provider value={contextValue}>
			{props.children}
		</WalletContext.Provider>
	);
};

export default WalletContextProvider;

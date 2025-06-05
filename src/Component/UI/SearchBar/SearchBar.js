import React, { useState, useRef, useContext } from 'react';
import style from './SearchBar.module.css';
import Button from '../../Utilities/Button';
import WalletContext from '../../../Store/wallet-context';

const SearchBar = () => {
	const [error, setError] = useState(null);
	const { setWallet } = useContext(WalletContext);
	const [input, setInput] = useState('');

	const isValidWalletAddress = (add) => {
		const regex = /^0x[a-fA-F0-9]{40}$/;
		return regex.test(add);
	};

	const handleChange = (e) => {
		const value = e.target.value.trim();
		setInput(value);
	};

	const handleSaveWallet = () => {
		if (isValidWalletAddress(input)) {
			setWallet(input);
			setError(null);
			setInput('');
		} else {
			setError('Invalid wallet address. Please enter a valid address');
		}
	};

	return (
		<div className={style.searchBar}>
			<input
				type='text'
				placeholder='Enter wallet address'
				value={input}
				className={style.input}
				onChange={handleChange}
			/>
			<Button
				onClick={handleSaveWallet}
				className={style.button}
				type='submit'>
				View Wallet
			</Button>
			{error && <p className={style.error}>{error}</p>}
		</div>
	);
};

export default SearchBar;

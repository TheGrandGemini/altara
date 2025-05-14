import React, { useState, useRef, useContext } from 'react';
import style from './SearchBar.module.css';
import Button from '../../Utilities/Button';
import WalletContext from '../../../Store/wallet-context';

const SearchBar = () => {
	const [error, setError] = useState(null);
	const inputRef = useRef(null);
	const { setWallet } = useContext(WalletContext);

	const isValidWalletAddress = (add) => {
		const regex = /^0x[a-fA-F0-9]{40}$/;
		return regex.test(add);
	};

	const handleSaveWallet = () => {
		const input = inputRef.current.value.trim();

		if (isValidWalletAddress(input)) {
			setWallet(input);
			setError(null);
			inputRef.current.value = '';
		} else {
			setError('Invalid wallet address. Please enter a valid address');
		}
	};

	return (
		<div className={style.searchBar}>
			<input
				type='text'
				placeholder='Enter wallet address'
				ref={inputRef}
				className={style.input}
			/>
			<Button
				onClick={handleSaveWallet}
				className={style.button}
				type='submit'>
				Fetch Balance
			</Button>
			{error && <p className={style.error}>{error}</p>}
		</div>
	);
};

export default SearchBar;

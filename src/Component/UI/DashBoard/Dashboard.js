import React, { useContext } from 'react';
import style from './Dashboard.module.css';
import WalletContext from '../../../Store/wallet-context';
import SearchBar from '../SearchBar/SearchBar';
import Tokens from '../DisplayBalance/Tokens';

const Dashboard = () => {
	const { wallet } = useContext(WalletContext);

	const hero = (
		<section
			className={style['hero-section']}
			id='home'>
			<h1 className={`${style['hero-h1']}  ${style['hero-heading-container']}`}>
				ALTARA
			</h1>
			<p className={`${style['hero=h2']} ${style['hero-heading-container']}`}>
				The Ultimate Web3 Portfolio Hub
			</p>
			<SearchBar />
		</section>
	);

	return (
		<main className={style.main}>
			{hero}
			{wallet !== null ? <Tokens /> : ''}
		</main>
	);
};

export default Dashboard;

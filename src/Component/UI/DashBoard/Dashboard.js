import React, { useContext } from 'react';
import style from './Dashboard.module.css';
import WalletContext from '../../../Store/wallet-context';
import SearchBar from '../SearchBar/SearchBar';
import TokensBalance from '../DisplayBalance/TokensBalance';
// import TransactionHistory from '../History/History';

const Dashboard = () => {
	const { wallet } = useContext(WalletContext);

	const hero = (
		<section
			className={style['hero-section']}
			id='home'>
			<h1 className={`${style['hero-h1']}  ${style['hero-heading-container']}`}>
				ALTARA
			</h1>
			<h2 className={`${style['hero=h2']} ${style['hero-heading-container']}`}>
				Track smarter. Move faster. Stay ahead.
			</h2>
			<p className={`${style['hero=h2']} ${style['hero-heading-container']}`}>
				Altara gives you full visibility into your tokens — across chains, in
				real time.
			</p>

			<SearchBar />
		</section>
	);

	return (
		<main className={style.main}>
			{hero}
			{wallet !== null ? (
				<TokensBalance address={wallet} />
			) : (
				<p>Please connect your wallet</p>
			)}
		</main>
	);
};

export default Dashboard;

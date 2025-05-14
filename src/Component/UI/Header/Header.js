import React, { useContext } from 'react';
import style from './Header.module.css';
import WalletContext from '../../../Store/wallet-context';
import Button from '../../Utilities/Button';

const Header = () => {
	const { wallet } = useContext(WalletContext);

	// const formattedWallet = `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;

	return (
		<header className={style.header}>
			<div>
				<h1 className={style.logo}>Altara</h1>
			</div>

			<nav className={style.navbar}>
				<ul className={style.navlists}>
					<li className={style.navlist}>
						<a href='#home'>Home</a>
					</li>
					<li className={style.navlist}>
						<a href='#balance'> Balance</a>
					</li>
					<li className={style.navlist}>
						<a href='#history'>History</a>
					</li>
				</ul>
			</nav>

			{wallet ? (
				<Button
					className={`${style.wallet}  ${style.btn}`}
					type='button'>
					Disconnect Wallet
				</Button>
			) : (
				<Button
					className={`${style.wallet}  ${style.btn}`}
					type='button'>
					Connect Wallet
				</Button>
			)}
		</header>
	);
};

export default Header;

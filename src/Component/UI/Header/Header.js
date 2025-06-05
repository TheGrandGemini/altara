import React, { useContext } from 'react';
import style from './Header.module.css';
import WalletContext from '../../../Store/wallet-context';
import Button from '../../Utilities/Button';
import { formatWalletAddress } from '../../Utilities/formatFtn';

const Header = () => {
	const { wallet, clearWallet } = useContext(WalletContext);

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

			<button
				onClick={clearWallet}
				className={`${style.wallet}  ${style.btn}`}
				type='button'>
				{wallet ? formatWalletAddress(wallet) : 'Paste a wallet'}
			</button>
		</header>
	);
};

export default Header;

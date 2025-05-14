import React from 'react';
import './App.css';
import Header from './Component/UI/Header/Header';
import WalletContextProvider from './Store/WalletContextProvider';
import Dashboard from './Component/UI/DashBoard/Dashboard';

function App() {
	return (
		<WalletContextProvider>
			<Header />
			<Dashboard />
		</WalletContextProvider>
	);
}

export default App;

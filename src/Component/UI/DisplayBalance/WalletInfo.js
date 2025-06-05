import React from 'react';
import { FaRegCopy } from 'react-icons/fa';
import { formatWalletAddress } from '../../Utilities/formatFtn';

const WalletInfo = ({ address, copied, handleCopy, totalBalance, style }) => (
    <div className={style.walletInfo}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <span
                className={style.add}
                style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                }}
                title="Click to copy wallet address"
            >
                Wallet: {formatWalletAddress(address)}
                <FaRegCopy
                    style={{ fontSize: 16, marginRight: 4 }}
                    onClick={handleCopy}
                />
            </span>
            {copied && (
                <span
                    style={{
                        position: 'absolute',
                        top: '-28px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#fff',
                        color: '#344e41',
                        padding: '2px 10px',
                        borderRadius: 6,
                        fontSize: 13,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        transition: 'opacity 0.2s',
                        opacity: copied ? 1 : 0,
                        pointerEvents: 'none',
                        zIndex: 10,
                    }}
                >
                    Copied!
                </span>
            )}
        </div>
        <p>Total Balance: {totalBalance}</p>
    </div>
);

export default WalletInfo;
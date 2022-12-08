import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useConfig } from '../../hooks/useConfig';
import { usePayment } from '../../hooks/usePayment';
import { BackButton } from '../buttons/BackButton';
import { Amount } from '../sections/Amount';
import { PoweredBy } from '../sections/PoweredBy';
import { QRCode } from '../sections/QRCode';
import css from './PendingPage.module.css';

const searchCollection = async () => {
  const response = await fetch("https://api.coralcube.cc/0dec5037-f67d-4da8-9eb6-97e2a09ffe9a/inspector/getMintActivities?update_authority=4zj22pu8yRyenFHwLmue28CqVmGFgVQt5FmVvwdP5fLa&collection_symbol=okay_bears&limit=10");
  const res = await response.json();
  console.log('res',res);
  return res;
}


const PendingPage: NextPage = () => {
    const { symbol, connectWallet } = useConfig();
    const { amount, reset } = usePayment();
    const { publicKey } = useWallet();
    const { setVisible } = useWalletModal();

    const [collection, setCollection] = useState([]);
    const handleClick = async () => {
        const res = await searchCollection();
        setCollection(res);
    }


    useEffect(() => {
        if (connectWallet && !publicKey) {
            setVisible(true);
        }
        handleClick();
    }, [connectWallet, publicKey, setVisible]);

    return (
        <div className={css.root}>
            <div className={css.header}>
                <BackButton onClick={reset}>Cancel</BackButton>
                {connectWallet ? <WalletMultiButton /> : null}
            </div>
            <div className={css.main}>
                <div className={css.amount}>
                    <Amount amount={amount} />
                    <span className={css.symbol}>{symbol}</span>
                </div>

                <div className={css.code}>
                    <QRCode />
                </div>
                <div className={css.amount}>Okay Bear #7030　Activities</div>
                {collection.map((item) => (
                    <div className={css.transaction}>
                        <div className={css.left}>
                            <div className={css.amount}>{item.price} SOL</div>
                        </div>
                        <div className={css.right}>
                            <div>marketplace: {item.marketplace}</div>
                            <div className={css.time}>time: {item.time}</div>
                        </div>
                    </div>
                ))}
                <div className={css.scan}>Scan this code with your Solana Pay wallet</div>
                <div className={css.confirm}>You'll be asked to approve the transaction</div>
            </div>
            <div className={css.footer}>
                <PoweredBy />
            </div>
        </div>
    );
};

export default PendingPage;

export function getServerSideProps() {
    // Required so getInitialProps re-runs on the server-side
    // If it runs on client-side then there's no req and the URL reading doesn't work
    // See https://nextjs.org/docs/api-reference/data-fetching/get-initial-props
    // const res = await searchCollection();
    // console.log(res);

    // const res = await axios.get(
    //     'https://api.coralcube.cc/0dec5037-f67d-4da8-9eb6-97e2a09ffe9a/inspector/getMintActivities?update_authority=4zj22pu8yRyenFHwLmue28CqVmGFgVQt5FmVvwdP5fLa&collection_symbol=okay_bears&limit=10',
    //     {
    //         headers: {
    //             Accept: 'application/json, text/plain, */*',
    //             'User-Agent': '*',
    //         },
    //     }
    // );
    // console.log('res ', res);

    return {
        props: {
            // initCollection: res
        },
    };
}

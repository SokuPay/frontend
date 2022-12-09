import { NextPage } from 'next';
import React, {useEffect} from 'react';
import { useMediaQuery } from 'react-responsive';
import { FullscreenButton } from '../buttons/FullscreenButton';
import { GenerateButton } from '../buttons/GenerateButton';
import { PoweredBy } from '../sections/PoweredBy';
import css from './IndexPage.module.css';
import {usePayment} from "../../hooks/usePayment";
import {useConfig} from "../../hooks/useConfig";
import BigNumber from "bignumber.js";
import {PublicKey} from "@solana/web3.js";

const IndexPage: NextPage = () => {
    const phone = useMediaQuery({ query: '(max-width: 767px)' });


    const { setAmount } = usePayment();
    const { price } = useConfig();
    useEffect(() => setAmount(new BigNumber(price)), [setAmount]);

    return phone ? (
        <div className={css.root}>
            <div className={css.top}>
                <FullscreenButton />
            </div>
            <div className={css.body}>
                <GenerateButton />
            </div>
            <PoweredBy />
        </div>
    ) : (
        <div className={css.root}>
            <div className={css.top}>
                <FullscreenButton />
            </div>
            <div className={css.body}>
                <GenerateButton />
            </div>
            <PoweredBy />
        </div>
    );
};

export default IndexPage;

export function getServerSideProps() {
    // Required so getInitialProps re-runs on the server-side
    // If it runs on client-side then there's no req and the URL reading doesn't work
    // See https://nextjs.org/docs/api-reference/data-fetching/get-initial-props

    // const res = await axios.get(
    //     'http://localhost:3010/main',
    //     {
    //         headers: {
    //             Accept: 'application/json, text/plain, */*',
    //             'User-Agent': '*',
    //         },
    //     }
    // );
    // console.log('res ', res);
    // const res = {
    //     payment_link: "solana:HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg?amount=0.001&reference=HMwNaAjEr2fzFM5xRHh9xJMn2ocQA8tSw9xcba1yJLoF&label=Buy&message=Thank+you+for+buying+NFT%21"
    // }


    return {
        props: { },
    };
}

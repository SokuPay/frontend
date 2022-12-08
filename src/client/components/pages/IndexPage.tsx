import { NextPage } from 'next';
import React, {useEffect} from 'react';
import { useMediaQuery } from 'react-responsive';
import { FullscreenButton } from '../buttons/FullscreenButton';
import { GenerateButton } from '../buttons/GenerateButton';
import { PoweredBy } from '../sections/PoweredBy';
import css from './IndexPage.module.css';
import {usePayment} from "../../hooks/usePayment";
import BigNumber from "bignumber.js";

const IndexPage: NextPage = () => {
    const phone = useMediaQuery({ query: '(max-width: 767px)' });


    const { setAmount } = usePayment();
    useEffect(() => setAmount(new BigNumber(0.01)), [setAmount]);


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
    return {
        props: {},
    };
}

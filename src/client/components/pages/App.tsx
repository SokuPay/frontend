import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { GlowWalletAdapter, PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { PublicKey } from '@solana/web3.js';
import { AppContext, AppProps as NextAppProps, default as NextApp } from 'next/app';
import { AppInitialProps } from 'next/dist/shared/lib/utils';
import { FC, useMemo } from 'react';
import { DEVNET_ENDPOINT } from '../../utils/constants';
import { ConfigProvider } from '../contexts/ConfigProvider';
import { FullscreenProvider } from '../contexts/FullscreenProvider';
import { PaymentProvider } from '../contexts/PaymentProvider';
import { ThemeProvider } from '../contexts/ThemeProvider';
import { SOLIcon } from '../images/SOLIcon';

interface AppProps extends NextAppProps {
    host: string;
    payment_link: any;
}

// const getTX = async () => {
//   const response = await fetch("http://localhost:3010/main", {method: "POST"});
//   const res = await response.json();
//   const payment_link = {
//         recipient: new PublicKey(res.recipient) || 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg' as string,
//         label:res.label || 'Buy' as string,
//         price: res.amount || 0.01,
//         txid: res.reference || '4c4kTFrEueXucBco3eLoC99rs8MVHoZiWejdQFozTeXZ',
//         message: res.message || 'Thank+you+for+buying+NFT%21',
//     };
//   return payment_link;
// }

const App: FC<AppProps> & { getInitialProps(appContext: AppContext): Promise<AppInitialProps> } = ({
    Component,
    host,
    payment_link,
    pageProps,
}) => {
    const baseURL = `https://${host}`;

    // If you're testing without a mobile wallet, set this to true to allow a browser wallet to be used.
    const connectWallet = false;
    // If you're testing without a mobile wallet, set this to Devnet or Mainnet to configure some browser wallets.
    const network = WalletAdapterNetwork.Devnet;

    const wallets = useMemo(
        () => (connectWallet ? [
            new GlowWalletAdapter({ network }),
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter({ network })
        ] : []),
        [connectWallet, network]
    );

    // Toggle comments on these lines to use transaction requests instead of transfer requests.
    const link = undefined;
    // const link = useMemo(() => new URL(`${baseURL}/api/`), [baseURL]);

    const recipient= new PublicKey(payment_link.recipient)
    const label = payment_link.label
    const price = payment_link.price
    const txid = new PublicKey(payment_link.txid)
    const message = payment_link.message

    // recipient = new PublicKey(recipientParam);
    // txid = new PublicKey(txidParam);


    return (
        <ThemeProvider>
            <FullscreenProvider>
                <ConnectionProvider endpoint={DEVNET_ENDPOINT}>
                    <WalletProvider wallets={wallets} autoConnect={connectWallet}>
                        <WalletModalProvider>
                            <ConfigProvider
                                baseURL={baseURL}
                                link={link}
                                recipient={recipient}
                                label={label}
                                message={message}
                                txid={txid}
                                price={price}
                                symbol="SOL"
                                icon={<SOLIcon />}
                                decimals={9}
                                minDecimals={1}
                                connectWallet={connectWallet}
                            >
                                    <PaymentProvider>
                                        <Component {...pageProps} />
                                    </PaymentProvider>
                            </ConfigProvider>
                        </WalletModalProvider>
                    </WalletProvider>
                </ConnectionProvider>
            </FullscreenProvider>
        </ThemeProvider>
    );
};

App.getInitialProps = async (appContext) => {
    const props = await NextApp.getInitialProps(appContext);

    const { req } = appContext.ctx;

    const host = req?.headers.host || 'localhost:3001';

    const response = await fetch("http://localhost:3010/main", {method: "POST"});
    const res = await response.json();
    const payment_link = {
        recipient: res.recipient || 'HXtBm8XZbxaTt41uqaKhwUAa6Z1aPyvJdsZVENiWsetg',
        label:res.label || 'Buy' as string,
        price: res.amount || 0.01,
        txid: res.reference || '4c4kTFrEueXucBco3eLoC99rs8MVHoZiWejdQFozTeXZ',
        message: res.message || 'Thank+you+for+buying+NFT%21',
    };

    return {
        ...props,
        host,
        payment_link,
    };
};

export default App;

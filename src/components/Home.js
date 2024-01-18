import React from 'react';
import { useAccount, useConnect, useContractRead } from 'wagmi';
import { InjectedConnector } from "wagmi/connectors/injected";
import { disconnect } from "@wagmi/core";
import { PublicLockV13 } from "@unlock-protocol/contracts";
import { Paywall } from "@unlock-protocol/paywall";
import { networks } from "@unlock-protocol/networks";

const CHAIN_ID = 5;
const lockAddress = "0x7a6f000a6016f3e81e7313236b7145f7309b9d51";

const paywallConfig = {
    locks: {
      [lockAddress]: {
        network: CHAIN_ID,
      },
    },
    skipRecipient: true,
    title: "NFT Gated Event Manager",
    pessimistic: true,
  };

const Home = () => {
    const { address, connector } = useAccount();

    const { data } = useContractRead({
        address: lockAddress,
        abi: PublicLockV13.abi,
        functionName: "balanceOf",
        args: [address],
        watch: true,
    });

    const { isConnected } = useAccount();

    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });

    const checkout = async () => {
        const provider = await connector.getProvider();

        const paywall = new Paywall(paywallConfig, networks, provider);

        await paywall.loadCheckoutModal(paywallConfig);
    }

    return (
        <div className="container">
            <div className="row">
            <div className="col-md-12">
                <nav className="navbar navbar-expand-lg navbar-light bg-primary">
                <a className="navbar-brand text-white" href="!#">
                    Event Gated Application
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarText"
                    aria-controls="navbarText"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav mr-auto">
                    
                    </ul>
                    
                    <span className="navbar-text">
                    {!isConnected ? <button className="btn btn-danger" onClick={() => connect()}>Connect Wallet</button> : <button onClick={() => disconnect()} className="btn btn-dark">Disconnect</button>}
                    </span>
                </div>
                </nav>

                <div className="text-center">
                    <h1 className='mt-3 mb-3'>Lumos Build for Web3 Event</h1>

                    {!isConnected && <p>Howdy! Connect wallet and check your attendance eligibility.</p>}

                    {isConnected && (
                        <>
                            {Number(data) > 0 ? <p>You have a ticket for this event</p> : <button className="btn btn-primary" onClick={checkout}>Register for Event</button>}
                        </>
                    )}
                </div>
            </div>
            </div>
        </div>
    )
}

export default Home;
import { ethers } from 'ethers';
import { WagmiConfig, createClient } from "wagmi";
import Home from "./components/Home";

const CHAIN_ID = 5;

const client = createClient({
  autoConnect: true,
  provider: new ethers.providers.JsonRpcProvider(`https://rpc.unlock-protocol.com/${CHAIN_ID}`, CHAIN_ID),
});

function App() {
  return (
    <WagmiConfig client={client}>
      <Home />
    </WagmiConfig>
  );
}

export default App;
import { ethers } from "ethers";
import { db } from "./db"
import dotenv from "dotenv"

const abi = [
    "event Stake(address indexed staker, uint256 amount)",
    "event Unstake(address indexed staker, uint256 amount)"
]

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS!, abi, provider)


console.log("🎧 Listening for events....");


contract.on("Stake", async (staker, amount, event) => {

    const txHash = event.log.transactionHash;
    const blockNumber = event.log.blockNumber
    console.log(txHash, blockNumber);
    console.log(`\nStake ${staker} staked ${amount.toString()}`);
    await db.query(`INSERT INTO stake_events (staker, amount, tx_hash, block_number)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (tx_hash) DO NOTHING`,
        [staker, amount.toString(), txHash, blockNumber])

})


contract.on("Unstake", async (staker, amount, event) => {
    console.log(`📤 Unstake: ${staker} unstaked ${amount.toString()}`);
    await db.query(
        `INSERT INTO stake_events (staker, amount, tx_hash, block_number)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (tx_hash) DO NOTHING`,
        [staker, `-${amount.toString()}`, event.transactionHash, event.blockNumber]
    );
});

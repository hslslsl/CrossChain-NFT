const { task } = require("hardhat/config")
const { networkConfig } = require("../helper-hardhat-config")

task("burn-and-cross")
    .addOptionalParam("chainselector", "chain selector of destination chain")
    .addOptionalParam("recevier", "receiver address on destination chain")
    .addParam("tokenid", "token ID to be crossed chain")
    .setAction(async(taskArgs, hre) => {
        let chainSelector
        let receiver
        const {firstAccount} = await getNamedAccounts()
        const tokenId = taskArgs.tokenid

        if(taskArgs.chainSelector){
            chainSelector = taskArgs.chainSelector
        }else {
            chainSelector = networkConfig[network.config.chainId].companionChainSelector
            console.log("chainselectoe is not set in command")
        }

        console.log(`chainselector is ${chainSelector}`)

        if(taskArgs.receiver){
            receiver = taskArgs.receiver
        }else {
            const NFTPoolLockAndReleaseDeployment = await (hre.companionNetworks["destChain"]
                .deployments.get("NFTPoolLockAndRelease"))
            receiver = NFTPoolLockAndReleaseDeployment.address
            console.log("receiver is not set in command")
        }

        console.log(`receiver's address is ${receiver}`)

        //transfer link token to address of the pool
        const linkTokenAddress = networkConfig[network.config.chainId].linkToken
        const linkToken = await ethers.getContractAt("LinkToken", linkTokenAddress)
        const nftPoolBurnAndMint = await ethers.getContract("nftPoolBurnAndMint", firstAccount)
        const transferTx = await linkToken.transfer(nftPoolBurnAndMint.target, ethers.parseEther("10"))
        await transferTx.wait(6)
        const balance = await linkToken.balanceOf(nftPoolBurnAndMint.target)
        console.log(`balance of the pool is ${balance}`)
        
        //approve pool address to call transferFrom
        const wnft = await ethers.getContract("WrappedMyToken", firstAccount)
        await wnft.approve(nftPoolBurnAndMint.target, tokenId)
        console.log("approve success")

        //call burnAndSendNFT
        const burnAndSendNFTtx = await nftPoolBurnAndMint.burnAndSendNFT(
            tokenId,
            firstAccount,
            chainSelector,
            receiver
        )
        console.log(`ccip transaction is sent, the tx hash is ${burnAndSendNFTtx.hash}`)

    })

module.exports = {}
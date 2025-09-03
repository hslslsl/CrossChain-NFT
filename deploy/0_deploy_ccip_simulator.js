const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config")

module.exports = async({getNamedAccounts, deployments}) => {
    if(developmentChains.includes(network.name)){
        const {firstAccount} = await getNamedAccounts();
        const {deploy, log} = deployments;

        log("Deploying CCIP Simulator contract")
        await deploy("CCIPLocalSimulator", {
            contract: "CCIPLocalSimulator",
            from: firstAccount,
            log: true,
            args: []
        })

        log("CCIP Simulator deployed successfully")
    }

}

module.exports.tags = ["test", "all"]
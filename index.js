const fs = require("fs"),
    abiDecoder = require('abi-decoder'),
    Web3 = require('web3'),
    solc = require('solc');

const input = fs.readFileSync('C:/Users/Evan/Desktop/aws/createContract/contracts/Token.sol');
const output = solc.compile(input.toString(), 1);
const bytecode = output.contracts[':Token'].bytecode;
const abi = JSON.parse(output.contracts[':Token'].interface);

let provider = new Web3.providers.HttpProvider("http://localhost:8545");
//let provider = new Web3.providers.HttpProvider("http://18.218.75.81:8545");
const web3 = new Web3(provider);
let Voting = new web3.eth.Contract(abi);

abiDecoder.addABI(abi);

function createContract(amount, description, terms, callback) {
    web3.eth.getAccounts().then(accounts => {
        allAccounts = accounts;
        Voting.deploy({ data: bytecode }).send({
            from: accounts[0],
            gas: 1500000,
            gasPrice: '30000000000000'
        }).on('receipt', receipt => {
            Voting.options.address = receipt.contractAddress;
            Voting.methods.createBond(amount, description, terms)
                .send({ from: accounts[0], gas: 1500000 })
                .then(transaction => {
                    web3.eth.getBlock(transaction.blockHash, true).then(value => {
                        callback({ contract: Voting, block: value })
                    });
                });
        });
    });
}

//main

createContract(function (value) { transfer(value.contract); });

//endmain



function transfer(contract) {
    web3.eth.getAccounts().then(accounts => {
        console.log(accounts);
        contract.methods.transfer(accounts[1], 500).send({ from: accounts[0] }).then(transaction => {
            console.log("Transfer lodged. Transaction ID: " + transaction.transactionHash);
            let blockHash = transaction.blockHash
            console.log(blockHash);
            return web3.eth.getBlock(blockHash, true);
        }).then(block => {
            block.transactions.forEach(transaction => {
                console.log(abiDecoder.decodeMethod(transaction.input));
            });

            allAccounts.forEach(account => {
                contract.methods.bonds(account).call({ from: allAccounts[0] }).then(amount => {
                    console.log(account + ": " + amount.accountType + " " + amount.balance + " " + amount.description);
                });
            });
        });
    });
}




exports.handler = (event, context, callback) => {



    var response = {
        "statusCode": 200,
        "headers": {
            "my_header": "my_value"
        },
        "body": JSON.stringify(""),
        "isBase64Encoded": false
    };

    callback(null, response);
};
const fs = require("fs"),
    Web3 = require('web3'),
    solc = require('solc');

const input = fs.readFileSync('contracts/Token.sol');
const output = solc.compile(input.toString(), 1);
const bytecode = output.contracts[':Token'].bytecode;
const abi = JSON.parse(output.contracts[':Token'].interface);

let provider = new Web3.providers.HttpProvider("http://18.218.75.81:8545");
const web3 = new Web3(provider);
let reinsurance = new web3.eth.Contract(abi);

function createContract(amount, description, terms, callback) {
    web3.eth.getAccounts().then(accounts => {
        allAccounts = accounts;
        reinsurance.deploy({ data: bytecode }).send({
            from: accounts[0],
            gas: 1500000,
            gasPrice: '30000000000000'
        }).on('receipt', receipt => {
            reinsurance.options.address = receipt.contractAddress;
            reinsurance.methods.createBond(amount, description, terms)
                .send({ from: accounts[0], gas: 1500000 })
                .then(transaction => {
                    allAccounts.forEach(account => {
                        contract.methods.bonds(account).call({ from: allAccounts[0] }).then(amount => {
                            console.log(account + ": " + amount.accountType + " " + amount.balance + " " + amount.description);
                        });
                    });

                    web3.eth.getBlock(transaction.blockHash, true).then(value => {
                        callback({ contract: reinsurance, block: value })
                    });
                });
        });
    });
}

exports.handler = (event, context, callback) => {
    var amount = event["queryStringParameters"]["amount"];
    var description = event["queryStringParameters"]["description"];
    var terms = event["queryStringParameters"]["terms"];
    createContract(amount, description, terms, function (returnValue) {
        var response = {
            "statusCode": 200,
            "headers": {
                "my_header": "my_value"
            },
            "body": JSON.stringify(returnValue),
            "isBase64Encoded": false
        };

        callback(null, response);
    });
};
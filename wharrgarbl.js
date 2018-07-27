

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



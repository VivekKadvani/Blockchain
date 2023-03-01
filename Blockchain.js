const SHA256 = require('crypto-js/sha256')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');// You can use any elliptic curve you want

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error("you can not sign for other's wallet")
        }

        const hashTx =this.calculateHash();
        const sig = signingKey.sign(hashTx , 'base64');
        this.signature = sig.toDER('hex');

    } 

    isValid(){
        if(this.fromAdress === null) return true;

        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress,'hex')
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}
class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.transactions = transactions;
        this.hash = this.calculateHash();
        this.nounce = 0;
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nounce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nounce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined : " + this.hash);
    }
    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }
        return true;
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createFirstBlock()]
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createFirstBlock() {
        return new Block('01/03/2023', 'First block', '0')
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAdress){
        let block = new Block(Date.now() , this.pendingTransactions,this.getLastBlock().hash);
        block.mineBlock(this.difficulty)

        console.log("mined block");
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAdress ,this.miningReward)
        ];
    }

    addTransaction(transaction){
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('transaction must include From and To address');
        }
        if(!transaction.isValid()){
            throw new Error("cannot add invalid transaction to chain");
        }
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 100 ;
        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }
                if(trans.toAddress === address){
                    balance +=trans.amount;
                }
            }
        }
        return balance;
    }
    validateChain() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const PreviousBlock = this.chain[i - 1];

            if(!currentBlock.hasValidTransactions()){
                return false;
            }
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== PreviousBlock.hash) {
                return false
            }
        }
        return true
    }
}
module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
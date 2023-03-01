const SHA256 = require('crypto-js/sha256')
class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.data = data;
        this.hash = this.calculateHash();
    }


    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createFirstBlock()]
    }

    createFirstBlock() {
        return new Block('0', '01/03/2023', 'First block', '0')
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLastBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    validateChain() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const PreviousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== PreviousBlock.hash){
                return false
            }
        }
        return true 
    }
}

let vcoin = new Blockchain();
vcoin.addBlock(new Block('1', '02/02/2023', { coin: 4 }))
vcoin.addBlock(new Block('2', '03/02/2023', { coin: 40 }))
console.log(vcoin.validateChain())
console.log(JSON.stringify(vcoin, null, 4))
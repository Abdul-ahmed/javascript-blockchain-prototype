const Block = require('./block')
const cryptoHash = require('../util/crypto_hash')

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()]
    }

    addBlock = ({data}) => {
        const newBlock = Block.mineBlock({
            previousBlock: this.chain[this.chain.length-1],
            data
        })

        this.chain.push(newBlock)
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false
        }

        for (let i = 1; i < chain.length; i++) {
            const block = chain[i]
            const {timestamp, previousHash, nonce, difficulty, hash, data} = block

            const actualPreviousHash = chain[i - 1].hash
            const lastDifficulty = chain[i - 1].difficulty
            if (previousHash !== actualPreviousHash) return false

            const validatedHash = cryptoHash(timestamp, previousHash, nonce, difficulty, data)
            if (hash !== validatedHash) return false;
            if (Math.abs(lastDifficulty - difficulty) > 1) return false
        }

        return true;
    }

    replaceChain(chain) {
        if (chain.length <= this.chain.length) {
            console.error("The incoming chain must be longer")
            return
        }

        if (!Blockchain.isValidChain(chain)) {
            console.error("The incoming chain must be valid")
            return
        }

        console.log("Replacing chain with new chain", chain)
        this.chain = chain
    }

}

module.exports = Blockchain;

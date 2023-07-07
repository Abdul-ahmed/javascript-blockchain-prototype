const hexToBinary = require('hex-to-binary')
const {GENESIS_DATA, MINE_RATE} = require("./config")
const cryptoHash = require("./crypto_hash")

class Block {
    constructor({timestamp, previousHash, hash, data, nonce, difficulty}) {
        this.timestamp = timestamp
        this.previousHash = previousHash
        this.hash = hash
        this.data = data
        this.nonce = nonce
        this.difficulty = difficulty
    }

    static genesis() {
        // return new Block(GENESIS_DATA)
        return new this(GENESIS_DATA)
    }

    static mineBlock({previousBlock, data}) {
        let timestamp, hash
        const previousHash = previousBlock.hash
        let {difficulty} = previousBlock
        let nonce = 0;

        do {
            nonce++
            timestamp = Date.now()
            difficulty = Block.adjustDifficulty({originalBlock: previousBlock, timestamp: timestamp})
            hash = cryptoHash(timestamp, nonce, difficulty, previousHash, data)
        } while (hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty))

        return new this({
            timestamp,
            previousHash,
            data,
            difficulty,
            nonce,
            hash
        })
    }

    static adjustDifficulty({originalBlock, timestamp}) {
        const {difficulty} = originalBlock
        if (difficulty < 1) return 1;
        if ((timestamp - originalBlock.timestamp) > MINE_RATE) return difficulty - 1
        return difficulty + 1
    }
}

// const block = new Block({
//     timestamp: "2023/06/30",
//     previousHash: "previous hash",
//     hash: "current hash",
//     data: "block data"
// })

// console.log(block)

module.exports = Block;
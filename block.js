const {GENESIS_DATA} = require("./config")
const cryptoHash = require("./crypto_hash")

class Block {
    constructor({timestamp, previousHash, hash, data}) {
        this.timestamp = timestamp
        this.previousHash = previousHash
        this.hash = hash
        this.data = data
    }

    static genesis() {
        // return new Block(GENESIS_DATA)
        return new this(GENESIS_DATA)
    }

    static mineBlock({previousBlock, data}) {
        const timestamp = Date.now()
        const previousHash = previousBlock.hash

        return new this({
            timestamp,
            previousHash,
            data,
            hash: cryptoHash(timestamp, previousHash, data)
        })
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
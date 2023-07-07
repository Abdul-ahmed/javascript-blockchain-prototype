const hexToBinary = require('hex-to-binary')
const Block = require("./block");
const { GENESIS_DATA, MINE_RATE } = require("../config");
const cryptoHash = require("../util/crypto_hash");

describe("Block", () => {
    const timestamp = 2000;
    const previousHash = "previous hash";
    const hash = "hash";
    const data = "block data";
    const nonce = 1;
    const difficulty = 1;

    const block = new Block({ timestamp, previousHash, hash, data, nonce, difficulty });

    it("Has a timestamp, previous hash, hash, data property, nonce and difficulty level", () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.previousHash).toEqual(previousHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });

    describe("genesis()", () => {
        const genesisBlock = Block.genesis()

        it("return a Block instant", () => {
            expect(genesisBlock instanceof Block).toBe(true)
        });

        it("return the genesis data", () => {
            expect(genesisBlock).toEqual(GENESIS_DATA)
        });
    });

    describe("mineBlock()", () => {
        const previousBlock = Block.genesis()
        const data = "Mining data";
        const minedBlock = Block.mineBlock({ previousBlock, data })

        it("return a Block instance", () => {
            expect(minedBlock instanceof Block).toBe(true)
        })

        it("sets the `previousHash` to be the `hash of the previousBlock ", () => {
            expect(minedBlock.previousHash).toEqual(previousBlock.hash)
        })

        it("sets the `data`", () => {
            expect(minedBlock.data).toEqual(data)
        })

        it("sets a `timestamp`", () => {
            expect(minedBlock.timestamp).not.toEqual(undefined)
        })

        it("create sha-256 `hash` based on the proper input", () => {
            expect(minedBlock.hash).toEqual(cryptoHash(
                minedBlock.timestamp,
                minedBlock.nonce,
                minedBlock.difficulty,
                previousBlock.hash,
                data
            ))
        })

        it("sets a `hash` that matches the difficulty criteria", () => {
            expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)).toEqual("0".repeat(minedBlock.difficulty))
        })

        it("adjusts the difficulty", () => {
            const possibleResult = [previousBlock.difficulty + 1, previousBlock - 1]
            expect(possibleResult.includes(minedBlock.difficulty)).toBe(true)
        })
    })

    describe("adjustDifficulty()", () => {
        it("raises the difficulty for a quickly mined block", () => {
            expect(Block.adjustDifficulty({
                originalBlock: block,
                timestamp: block.timestamp + MINE_RATE - 100
            })).toEqual(block.difficulty + 1)
        })

        it("lower the difficulty for a quickly mined block", () => {
            expect(Block.adjustDifficulty({
                originalBlock: block,
                timestamp: block.timestamp + MINE_RATE + 100
            })).toEqual(block.difficulty - 1)
        })

        it("has lower limit of 1", () => {
            block.difficulty = -1
            expect(Block.adjustDifficulty({originalBlock: block})).toEqual(1)
        })
    })
});

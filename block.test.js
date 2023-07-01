const { it } = require("node:test");
const Block = require("./block");
const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto_hash");

describe("Block", () => {
    const timestamp = "2023/06/30";
    const previousHash = "previous hash";
    const hash = "hash";
    const data = "block data";
    const block = new Block({ timestamp, previousHash, hash, data });

    it("Has a timestamp, previous hash, hash, and data property", () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.previousHash).toEqual(previousHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
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

        test("sets a `timestamp`", () => {
            expect(minedBlock.timestamp).not.toEqual(undefined)
        })

        it("create sha-256 `hash` based on the proper input", () => {
            expect(minedBlock.hash).toEqual(cryptoHash(minedBlock.timestamp, minedBlock.previousHash, data))
        })
    })
});

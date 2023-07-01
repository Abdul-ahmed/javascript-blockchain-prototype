const Blockchain = require('./blockchain')
const Block = require('./block')

describe("Blockchain", () => {
    const blockchain = new Blockchain()

    it("expect a `chain` array instance", () => {
        expect(blockchain.chain instanceof Array).toBe(true)
    })

    it("starts with a genesis block", () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis())
    })

    it("add new block", () => {
        const newData = "Hello World"
        blockchain.addBlock({data: newData})
        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData)
    })
})
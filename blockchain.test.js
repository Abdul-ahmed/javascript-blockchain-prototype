const Blockchain = require('./blockchain')
const Block = require('./block')

describe("Blockchain", () => {
    let blockchain, newBlockchain, originalBlockchainChain

    beforeEach(() => {
        blockchain = new Blockchain()
        newBlockchain = new Blockchain()
        originalBlockchainChain = blockchain.chain
    })

    it("expect a `chain` array instance", () => {
        expect(blockchain.chain instanceof Array).toBe(true)
    })

    it("starts with a genesis block", () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis())
    })

    it("add new block to the chain", () => {
        const newData = "Hello World"
        blockchain.addBlock({data: newData})
        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData)
    })

    describe("isValidChain()", () => {
        describe("when the chain does not start with the genesis block", () => {
            it("return false", () => {
                blockchain.chain[0] = {data: "fake-genesis"}
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
            })
        })

        describe("when the chain starts with the genesis block and has multiple blocks", () => {
            beforeEach(() => {
                blockchain.addBlock({data: "I"})
                blockchain.addBlock({data: "Love"})
                blockchain.addBlock({data: "You"})
            })

            describe("and a previousHash reference has changed", () => {
                it("return false", () => {
                    blockchain.chain[2].previousHash = "broken-lastHash"
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
                })
            })

            describe("and the chain contains a block with an invalid field", () => {
                it("returns false", () => {
                    blockchain.chain[2].data = "bad-data"
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false)
                })
            })

            describe("and the chain does not contain any invalid block", () => {
                it("return true", () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true)
                })
            })
        })
    })

    describe("replaceChain()", () => {
        let errorMock, logMock;

        beforeEach(() => {
            errorMock = jest.fn()
            logMock = jest.fn()

            global.console.error = errorMock
            global.console.log = logMock
        })

        describe("when the new chain is not longer", () => {
            beforeEach(() => {
                newBlockchain.chain[0] = {new: "chain"}
                blockchain.replaceChain(newBlockchain.chain)
            })

            it("does not replace the chain", () => {
                expect(blockchain.chain).toEqual(originalBlockchainChain)
            })

            it("logs an error", () => {
                expect(errorMock).toHaveBeenCalled()
            })
        })

        describe("when the new chain is longer", () => {
            beforeEach(() => {
                newBlockchain.addBlock({data: "I"})
                newBlockchain.addBlock({data: "Love"})
                newBlockchain.addBlock({data: "You"})
            })

            describe("and the chain is invalid", () => {
                beforeEach(() => {
                    newBlockchain.chain[2].hash = "some fake"
                    blockchain.replaceChain(newBlockchain.chain)
                })

                it("does not replace the chain", () => {
                    expect(blockchain.chain).toEqual(originalBlockchainChain)
                })

                it("logs an error", () => {
                    expect(errorMock).toHaveBeenCalled()
                })
            })

            describe("and the chain is valid", () => {
                beforeEach(() => {
                    blockchain.replaceChain(newBlockchain.chain)
                })

                it("replace the chain", () => {
                    expect(blockchain.chain).toEqual(newBlockchain.chain)
                })

                it("logs about the chain replacement", () => {
                    expect(logMock).toHaveBeenCalled()
                })
            })
        })
    })
})
const Blockchain = require("./blockchain")

const blockchain = new Blockchain()

blockchain.addBlock({data: "initial"})

console.log("First block", blockchain.chain[blockchain.chain.length - 1])

let previousTimestamp, nextTimestamp, nextBlock, timeDifference, average;

const times = []

for (let i = 0; i < 10000; i++) {
    previousTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp
    
    blockchain.addBlock({ data: `block ${i}` })
    
    nextBlock = blockchain.chain[blockchain.chain.length - 1]
    nextTimestamp = nextBlock.timestamp
    timeDifference = nextTimestamp - previousTimestamp
    times.push(timeDifference)

    average = times.reduce((total, num) => (total + num))/times.length
    console.log(`Time to mine block: ${timeDifference}ms. Difficulty: ${nextBlock.difficulty}. Average time: ${average}ms`)
}
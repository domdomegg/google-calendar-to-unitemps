const readline = require('readline')

const read = (prompt, fallback) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: false })
  return new Promise(resolve => rl.question(prompt + ': ' + (fallback ? `(${fallback}) ` : ''), res => {
    rl.close()
    resolve(res || fallback)
  }))
}

const interactiveSelect = async (items, itemFormatter, itemMatcher, itemName = 'item') => {
  console.log(`${itemName[0].toUpperCase() + itemName.slice(1)}s:`)
  console.log(items.map((item, index) => `  ${index}: ${itemFormatter(item)}`).join('\n'))

  const res = await read(`Please select a ${itemName}`)
  let item

  // If entered a number, use that as index into the item list
  if (/^(0|[1-9]\d*)$/.test(res) && parseInt(res) < items.length) {
    item = items[parseInt(res)]
  } else {
    item = itemMatcher(items, res)
  }

  console.log(`Selected ${itemFormatter(item)}`)
  return item
}

module.exports = { read, interactiveSelect }

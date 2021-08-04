const name = process.env.NAME ?? 'adam'

console.log('hi', name, new Date())

setInterval(() => console.log('hi', name, new Date()), 30 * 1000)

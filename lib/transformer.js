'use strict'

const zipObject = require('lodash/zipObject')

const maps = require('./maps')
const { isSnapshot } = require('./helper.js')

module.exports = (exports = transform)
function transform (data, key, symbol) {

  const [type] = (key.includes('/') ? key.split('/')[2] : key).split('?')
  const subtype = symbol ? getSubtype(symbol) : 'tradingPairs'

  if (!maps[type] || !maps[type][subtype]) { return data }
  const props = maps[type][subtype]

  if (data[0] === 'tu' || data[0] === 'te') {
    data[1] = zipObject(props, data[1])
    return data
  }

  if (!isSnapshot(data)) {
    return zipObject(props, data)
  }

  const res = data.map((list) => {
    return zipObject(props, list)
  })

  return res
}

exports.normalize = normalize
function normalize (name) {
  if (!name) return

  const type = name.split('/')[0]
  const symbol = name.split('/')[1]

  return { type, symbol }
}

exports.getSubtype = getSubtype
function getSubtype (symbol) {
  return (/^t/).test(symbol) ? 'tradingPairs' : 'fundingCurrencies'
}

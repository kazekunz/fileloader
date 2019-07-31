const recursiveReaddirSync = require('recursive-readdir-sync')

const loadFromArray = function(path, extensionList, files) {
  const matcher = function(path, extensionList) {
    let matchedExtension = false
    for (let extension of extensionList) {
      if (path.indexOf('.' + extension + '.js') !== -1) {
        matchedExtension = extension
        break
      }
    }
    return matchedExtension
  }
  let initObject = {}
  for (let key in extensionList) {
    initObject[extensionList[key]] = {}
  }

  files = files.reduce((current, next) => {
    let matchedExtension = matcher(next, extensionList)
    if (matchedExtension) {
      let config = require(next)
      let configName = next
        .replace(path, '')
        .replace('/', '')
        .split('.')[0]
      current[matchedExtension][configName] = config
    }
    return current
  }, initObject)
  return files
}

const loadFromString = function(path, extension, files) {
  files = files.reduce((current, next) => {
    if (next.indexOf('.' + extension + '.js') !== -1 && !next.match(/map$/)) {
      let config = require(next)
      let configName = next
        .replace(path, '')
        .replace('/', '')
        .split('.')[0]
      current[configName] = config
    }
    return current
  }, {})
  return files
}

module.exports = function load(path, extension) {
  const files = recursiveReaddirSync(path)
  const isMultipleExtension = typeof extension === 'object'
  const loader = isMultipleExtension ? loadFromArray : loadFromString
  return loader(path, extension, files)
}

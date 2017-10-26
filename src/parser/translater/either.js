const Token = require('./token.js')

class Either extends Token {
  constructor(compositions) {
    super()

    this.compositions = compositions
  }

  compare(result) {
    for (const composition of this.compositions) {
      if (this.compareComposition(composition, result)) return true
    }

    return false
  }

  compareComposition(composition, result) {
    if (result.constructor.name === 'Token') {
      if (composition.compare(result)) return true
    } else {
      // TODO
    }

    return false
  }

  getMatchingComposition(result) {
    for (const composition of this.compositions) {
      if (this.compareComposition(composition, result)) return composition
    }

    return null
  }

  run(result) {
    const match = this.getMatchingComposition(result)
    
    if (match !== null) {
      if (this.ref === null) {
        if (this.shouldStore()) {
          // this.insertIntoStore(token.value)
          this.insertIntoScope(match.value, scope)
        }
      } else {
        if (this.shouldBeRetrieved()) {
          this.getRetrieved(result.value)
        }
      }

    } else {
      console.log('no matching result found in Either')
    }
  }
}

module.exports = Either

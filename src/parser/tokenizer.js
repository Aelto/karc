const keywords = require('./keywords.js')

module.exports = (input) => {
  const tokens = [];
  let current = 0;
  let slice = input.substring(0);

  // used only in case of error
  let cursor_y = 1;
  let cursor_x = 1;

  const advance = () => {
    current++;
  };

  const addToken = (type, value) => {
    tokens.push({ type, value, pos: current });
  };

  const keywords_keys = Object.keys(keywords);
  const checkKeywords = (slice) => {
    for (let i = 0; i < keywords_keys.length; i++) {
      const currentKeyword = keywords[keywords_keys[i]];

      if (!isToken(currentKeyword.r, slice)) {
        addToken(keywords_keys[i], currentKeyword.s);
        current += currentKeyword.s.length;

        return true;
      }
    }

    return false;
  }

  while (current < input.length) {
    const char = input.charAt(current);
    slice = input.substring(current);

    cursor_x++;
    let sub_current = 0;
    let sub_char = char;

    switch (char) {
      case '\n':
        cursor_y += 1;
        cursor_x = 1;
        current++;
        break;

      case '(':
        addToken('left-paren', '(');
        current++;
        break;

      case ')':
        addToken('right-paren', ')');
        current++;
        break;

      case '{':
        addToken('left-brace', '{');
        current++;
        break;

      case '}':
        addToken('right-brace', '}');
        current++;
        break;

      case ',':
        addToken('comma', ',');
        current++;
        break;

      case '.':
        addToken('dot', '.');
        current++;
        break;

      case ';':
        addToken('semicolon', ';');
        current++;
        break;

      case '!':
        if (!slice.indexOf('!=')) {

          addToken('bang-equal', '!=');
          current += 2;
        } else {

          addToken('bang', '!');
          current++;
        }
        break;

      case '+':
        if (!slice.indexOf('+=')) {

          addToken('plus-equal', '+=');
          current += 2;
        } else {

          addToken('plus', '+');
          current++;
        }
        break;

      case '-':
        if (!slice.indexOf('-=')) {

          addToken('minus-equal', '-=');
          current += 2;
        } else {

          addToken('minus', '-');
          current++;
        }

      case '*':
        if (!slice.indexOf('*=')) {

          addToken('star-equal', '*=');
          current += 2;
        } else {

          addToken('star', '*');
          current++;
        }
        break;

      case '/':
        if (!slice.indexOf('/=')) {

          addToken('slash-equal', '/=');
          current += 2;
        } else {

          addToken('slash', '/');
          current++;
        }
        break;

      case '=':
        if (!slice.indexOf('==')) {

          addToken('equal-equal', '==');
          current += 2;
        } else {

          addToken('equal', '=');
          current++;
        }
        break;

      case '>':
        if (!slice.indexOf('>=')) {

          addToken('greater-equal', '>=');
          current += 2;
        } else {

          addToken('greater', '>');
          current++;
        }
        break;

      case '<':
        if (!slice.indexOf('<=')) {

          addToken('less-equal', '<=');
          current += 2;
        } else {

          addToken('less', '<');
          current++;
        }
        break;

      case '"':
        sub_current = 1;
        sub_char = slice.charAt(sub_current);

        while (sub_current < slice.length) {
          sub_char = slice.charAt(sub_current);

          if (sub_char === '"') {
            addToken('string', slice.substring(1, sub_current));
            current += sub_current + 1;
            break;
          }

          sub_current++;
        }

        if (sub_current >= slice.length) {
          throw `unterminated string at ${cursor_y}:${cursor_x} "${slice.substring(1, 12 > slice.length ? slice.length : 12)}...`;
        }
        break;

      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '0':
        sub_current = 0;
        sub_char = slice.charAt(sub_current);

        // set to true when a '.' is encountered
        let isFloat = false;

        while (sub_current < slice.length) {
          sub_char = slice.charAt(sub_current);

          if (sub_char === '.') {
            isFloat = true;
          }

          if (!isDigit(sub_char) && sub_char !== '.') {
            addToken(
              isFloat ? 'number-float' : 'number',
              slice.substring(0, sub_current)
            );
            current += sub_current + 1;
            break;
          }

          sub_current++;
        }
        break;

      case ' ':
      case '\r':
        current++;
        break;

      default:
        if (checkKeywords(slice)) {
          
        } else if (char.match(/[aA-zZ]/)) {
          // look for any identifier
          sub_current = 0;
          sub_char = slice.charAt(sub_current);

          while (sub_current < slice.length) {
            sub_char = slice.charAt(sub_current);

            if (sub_char.match(/([aA-zZ]|[0-9])/) === null) {
              addToken('identifier', slice.substring(0, sub_current));
              current += sub_current - 1;
              break;
            }

            sub_current++;
          }
        } else {
          throw `unrecognized character at ${cursor_y}:${cursor_x} ${char}`;
        }

        current++;
        continue;
        throw `unrecognized character at ${cursor_y}:${cursor_x} ${char}`;

        break;
    }

  }

  return tokens;
}

const ALPHA = /([A-Z]|[a-z])/;
function isAlpa(char) {
  return char.match(ALPHA);
}

const DIGIT = /([0-9])/;
function isDigit(char) {
  return char.match(DIGIT);
}

function isToken(tokenRegex, slice) {
  const match = slice.match(tokenRegex)

  if (match === null) {

    return -1;
  } else {

    return match.index;
  }
}
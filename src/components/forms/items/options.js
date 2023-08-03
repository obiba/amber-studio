function getFileDelim (file) {
  return file.name.endsWith('.tsv') ? '\t' : ','
}

function cleanToken (token) {
  if (token.startsWith('"') && token.endsWith('"')) {
    return token.substring(1, token.length - 1)
  }
  if (token.startsWith('\'') && token.endsWith('\'')) {
    return token.substring(1, token.length - 1)
  }
  return token
}

export { getFileDelim, cleanToken }

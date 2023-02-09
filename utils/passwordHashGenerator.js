
const generatePwHash = async (password) => {
  console.log(password)
  const bcrypt = require('bcryptjs')

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  console.log(passwordHash)
}
let password = ''

if (process.argv.length > 2) {
  password = process.argv[2]
}
generatePwHash(password)
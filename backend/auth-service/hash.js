const bcrypt = require('bcrypt');

const users = [
  { role: 'admin', password: 'adminpass' },
  { role: 'rep', password: 'reppass' },
  { role: 'instructor', password: 'instructorpass' },
  { role: 'student', password: 'studentpass' },
];

(async () => {
  for (const { role, password } of users) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`${role}: ${hash}`);
  }
})();

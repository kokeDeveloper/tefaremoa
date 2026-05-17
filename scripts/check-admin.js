const { PrismaClient } = require('../src/app/generated/prisma');
const p = new PrismaClient();
p.admin.findMany()
  .then(r => {
    console.log(JSON.stringify(r.map(a => ({
      id: a.id,
      email: a.email,
      isActive: a.isActive,
      role: a.role,
      passLen: a.password.length
    })), null, 2));
    return p.$disconnect();
  })
  .catch(e => {
    console.error('ERROR:', e.message);
    return p.$disconnect();
  });

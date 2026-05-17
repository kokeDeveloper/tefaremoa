const { PrismaClient } = require('../src/app/generated/prisma');
const p = new PrismaClient();
p.student.findMany({ select: { id: true, name: true, lastName: true, email: true, password: true } })
  .then(r => {
    r.forEach(s => {
      const isBcrypt = s.password && /^\$2[aby]\$/.test(s.password);
      console.log(`ID:${s.id} | ${s.name} ${s.lastName} | ${s.email} | pwd_type:${isBcrypt ? 'bcrypt' : 'plaintext('+s.password+')'}`);
    });
    return p.$disconnect();
  })
  .catch(e => { console.error('ERROR:', e.message); return p.$disconnect(); });

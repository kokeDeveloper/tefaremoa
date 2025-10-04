(async function(){
  try{
  const base = process.env.BASE_URL || 'http://localhost:3000';
    console.log('1) POST /api/auth/login');
    let r = await fetch(base + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'napatalama@gmail.com', password: '123momia' }),
      redirect: 'manual'
    });
    console.log('status', r.status);
    let bodyText = await r.text();
    try{ console.log('body', JSON.parse(bodyText)); }catch(e){ console.log('bodyText', bodyText); }
    const setCookies = r.headers.get('set-cookie');
    console.log('raw set-cookie header:', setCookies);
    const cookies = setCookies ? setCookies.split(/, (?=[^;]+=)/).map(c=>c.split(';')[0]).join('; ') : '';
    console.log('cookie to reuse:', cookies);

    console.log('\n2) GET /api/students with cookie');
    r = await fetch(base + '/api/students', { headers: { cookie: cookies } });
    console.log('status', r.status);
    try{ console.log('body', await r.json()); }catch(e){ console.log('bodyText', await r.text()); }

    console.log('\n3) POST /api/students create student with cookie');
    const newEmail = `smoke${Date.now()}@example.com`;
    r = await fetch(base + '/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', cookie: cookies },
      body: JSON.stringify({ firstName: 'Smoke', lastName: 'Test', email: newEmail, password: '123momia' })
    });
    console.log('status', r.status);
    try{ console.log('body', await r.json()); }catch(e){ console.log('bodyText', await r.text()); }

  }catch(err){
    console.error('Error in smoke-test:', err);
    process.exitCode = 2;
  }
})();

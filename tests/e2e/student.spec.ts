// @ts-ignore: playwright not installed in this environment
import { test, expect } from '@playwright/test';

const base = 'http://localhost:3000';

test('auth -> create -> delete student (API)', async ({ request }: any) => {
  // login
  const login = await request.post(base + '/api/auth/login', { data: { email: 'napatalama@gmail.com', password: '123momia' } });
  expect(login.status()).toBe(200);
  const cookies = login.headers()['set-cookie'];
  const cookie = cookies ? cookies.join('; ') : '';

  // create
  const email = `e2e${Date.now()}@example.com`;
  const create = await request.post(base + '/api/students', { data: { firstName: 'E2E', lastName: 'Test', email, password: '123momia' }, headers: { cookie } });
  expect([200,201]).toContain(create.status());
  const body = await create.json();
  const id = body.id;
  expect(id).toBeGreaterThan(0);

  // delete
  const del = await request.delete(base + `/api/students/${id}`, { headers: { cookie } });
  expect([200,204]).toContain(del.status());
});

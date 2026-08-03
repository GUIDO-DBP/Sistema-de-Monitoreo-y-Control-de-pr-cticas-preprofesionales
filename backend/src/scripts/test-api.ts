import http from 'http';

const BASE_URL = 'http://localhost:3001';

interface TestResult {
  prueba: string;
  esperado: string;
  obtenido: string;
  estado: 'APROBADO' | 'FALLIDO';
}

const results: TestResult[] = [];

function request(
  method: string,
  path: string,
  body?: Record<string, unknown>,
  token?: string,
): Promise<{ status: number; body: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const payload = body ? JSON.stringify(body) : '';

    const req = http.request(
      url,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed: any;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
          resolve({ status: res.statusCode || 500, body: parsed });
        });
      },
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Executing API Suite Tests...\n');

  // 1. Healthcheck
  {
    const res = await request('GET', '/api/health');
    const pass = res.status === 200 && res.body?.status === 'ok' && res.body?.service === 'SMCPP API';
    results.push({
      prueba: 'GET /api/health',
      esperado: 'HTTP 200, { status: "ok", service: "SMCPP API" }',
      obtenido: `HTTP ${res.status}, ${JSON.stringify(res.body)}`,
      estado: pass ? 'APROBADO' : 'FALLIDO',
    });
  }

  // 2. Login Coordinador (usando correo)
  let coordToken = '';
  {
    const res = await request('POST', '/api/auth/login', {
      correo: 'coordinador@unap.edu.pe',
      password: 'Coordinador123*',
    });
    const pass = res.status === 200 && !!res.body?.data?.token && res.body?.data?.user?.rol === 'COORDINADOR';
    if (pass) coordToken = res.body.data.token;
    results.push({
      prueba: 'POST /api/auth/login (Coordinador)',
      esperado: 'HTTP 200, token JWT emitido, rol COORDINADOR',
      obtenido: `HTTP ${res.status}, rol=${res.body?.data?.user?.rol}, token=${coordToken ? 'emitido' : 'null'}`,
      estado: pass ? 'APROBADO' : 'FALLIDO',
    });
  }

  // 3. Login Estudiante (usando correo)
  let studentToken = '';
  {
    const res = await request('POST', '/api/auth/login', {
      correo: 'ana.torres@unap.edu.pe',
      password: 'Estudiante123*',
    });
    const pass = res.status === 200 && !!res.body?.data?.token && res.body?.data?.user?.rol === 'ESTUDIANTE';
    if (pass) studentToken = res.body.data.token;
    results.push({
      prueba: 'POST /api/auth/login (Estudiante Ana)',
      esperado: 'HTTP 200, token JWT emitido, rol ESTUDIANTE',
      obtenido: `HTTP ${res.status}, rol=${res.body?.data?.user?.rol}, token=${studentToken ? 'emitido' : 'null'}`,
      estado: pass ? 'APROBADO' : 'FALLIDO',
    });
  }

  // 4. GET /api/auth/me (Coordinador)
  {
    const res = await request('GET', '/api/auth/me', undefined, coordToken);
    const pass = res.status === 200 && res.body?.data?.email === 'coordinador@unap.edu.pe' && !res.body?.data?.passwordHash;
    results.push({
      prueba: 'GET /api/auth/me (Autenticado)',
      esperado: 'HTTP 200, datos del usuario sin passwordHash',
      obtenido: `HTTP ${res.status}, email=${res.body?.data?.email}, passwordHash=${res.body?.data?.passwordHash ?? 'excluido'}`,
      estado: pass ? 'APROBADO' : 'FALLIDO',
    });
  }

  // 5. GET /api/empresas
  {
    const res = await request('GET', '/api/empresas', undefined, coordToken);
    const pass = res.status === 200 && Array.isArray(res.body?.data) && res.body.data.length >= 1;
    results.push({
      prueba: 'GET /api/empresas',
      esperado: 'HTTP 200, lista de empresas',
      obtenido: `HTTP ${res.status}, total=${res.body?.data?.length}`,
      estado: pass ? 'APROBADO' : 'FALLIDO',
    });
  }

  // 6. GET /api/convenios
  {
    const res = await request('GET', '/api/convenios', undefined, coordToken);
    const pass = res.status === 200 && Array.isArray(res.body?.data) && res.body.data.length >= 1;
    results.push({
      prueba: 'GET /api/convenios',
      esperado: 'HTTP 200, lista de convenios',
      obtenido: `HTTP ${res.status}, total=${res.body?.data?.length}`,
      estado: pass ? 'APROBADO' : 'FALLIDO',
    });
  }

  // 7. GET /api/postulaciones (Coordinador ve todas vs Estudiante ve la suya)
  {
    const resCoord = await request('GET', '/api/postulaciones', undefined, coordToken);
    const resStudent = await request('GET', '/api/postulaciones', undefined, studentToken);
    const pass = resCoord.status === 200 && resStudent.status === 200 &&
      resCoord.body?.data?.length >= resStudent.body?.data?.length;
    results.push({
      prueba: 'GET /api/postulaciones (Aislamiento por rol)',
      esperado: 'HTTP 200, estudiante ve solo su postulación',
      obtenido: `HTTP ${resStudent.status}, postulaciones_estudiante=${resStudent.body?.data?.length}, postulaciones_coord=${resCoord.body?.data?.length}`,
      estado: pass ? 'APROBADO' : 'FALLIDO',
    });
  }

  // 8. GET /api/notificaciones (Aislamiento por usuario)
  {
    const resCoord = await request('GET', '/api/notificaciones', undefined, coordToken);
    const resStudent = await request('GET', '/api/notificaciones', undefined, studentToken);
    const pass = resCoord.status === 200 && resStudent.status === 200 &&
      resCoord.body?.data?.every((n: any) => n.usuarioId !== resStudent.body?.data[0]?.usuarioId);
    results.push({
      prueba: 'GET /api/notificaciones (Aislamiento por usuario)',
      esperado: 'HTTP 200, solo notificaciones pertenecientes al usuario',
      obtenido: `HTTP 200, notifs_coordinador=${resCoord.body?.data?.length}, notifs_estudiante=${resStudent.body?.data?.length}`,
      estado: pass ? 'APROBADO' : 'FALLIDO',
    });
  }

  // 9. Seguridad: Petición protegida sin token -> 401
  {
    const res = await request('GET', '/api/auth/me');
    const pass = res.status === 401 && res.body?.code === 'NO_TOKEN';
    results.push({
      prueba: 'Seguridad: Petición sin token',
      esperado: 'HTTP 401, error NO_TOKEN',
      obtenido: `HTTP ${res.status}, code=${res.body?.code}`,
      estado: pass ? 'APROBADO' : 'FALLIDO',
    });
  }

  // 10. Seguridad: Estudiante intenta crear empresa -> 403
  {
    const res = await request('POST', '/api/empresas', {
      nombre: 'Empresa Falsa',
      rubro: 'TI',
      ubicacion: 'Puno',
      modalidad: 'Remoto',
      vacantes: 2,
    }, studentToken);
    const pass = res.status === 403 && res.body?.code === 'FORBIDDEN';
    results.push({
      prueba: 'Seguridad: Estudiante no puede crear empresa',
      esperado: 'HTTP 403, error FORBIDDEN',
      obtenido: `HTTP ${res.status}, code=${res.body?.code}`,
      estado: pass ? 'APROBADO' : 'FALLIDO',
    });
  }

  // 11. Seguridad: Contraseña incorrecta -> 401
  {
    const res = await request('POST', '/api/auth/login', {
      correo: 'coordinador@unap.edu.pe',
      password: 'PasswordInvalido123*',
    });
    const pass = res.status === 401 && res.body?.code === 'INVALID_CREDENTIALS';
    results.push({
      prueba: 'Seguridad: Login contraseña incorrecta',
      esperado: 'HTTP 401, error INVALID_CREDENTIALS',
      obtenido: `HTTP ${res.status}, code=${res.body?.code}`,
      estado: pass ? 'APROBADO' : 'FALLIDO',
    });
  }

  // Print results table
  console.log('================================================================================');
  console.table(results);
  console.log('================================================================================');

  const allPassed = results.every((r) => r.estado === 'APROBADO');
  if (allPassed) {
    console.log('✅ ALL API TESTS PASSED SUCCESSFULLY!');
  } else {
    console.error('❌ SOME TESTS FAILED');
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Unexpected error during API testing:', err);
  process.exit(1);
});

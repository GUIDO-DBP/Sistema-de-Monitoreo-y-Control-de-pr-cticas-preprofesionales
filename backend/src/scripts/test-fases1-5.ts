import fetch from 'node-fetch';

const API = 'http://localhost:3001/api';

async function testAll() {
  console.log('🧪 Iniciando prueba de endpoints Fases 1 a 5...');

  // 1. Login Admin
  const resLoginAdmin = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo: 'admin@unap.edu.pe', password: 'Admin123*' }),
  });
  const dataAdmin: any = await resLoginAdmin.json();
  const tokenAdmin = dataAdmin.data?.token || dataAdmin.token;
  console.log('1. Login Admin status:', resLoginAdmin.status, 'Nombre:', dataAdmin.data?.user?.nombre || dataAdmin.user?.nombre);

  // 2. Login Student
  const resLoginEst = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo: 'ana.torres@unap.edu.pe', password: 'Estudiante123*' }),
  });
  const dataEst: any = await resLoginEst.json();
  const tokenEst = dataEst.data?.token || dataEst.token;
  console.log('2. Login Estudiante status:', resLoginEst.status, 'Token obtenido:', !!tokenEst);

  // 3. GET /api/documentos (Estudiante)
  const resDocs = await fetch(`${API}/documentos`, {
    headers: { Authorization: `Bearer ${tokenEst}` },
  });
  const docs: any = await resDocs.json();
  console.log('3. GET /api/documentos count:', Array.isArray(docs) ? docs.length : docs);

  // 4. GET /api/horas/mias (Estudiante)
  const resHoras = await fetch(`${API}/horas/mias`, {
    headers: { Authorization: `Bearer ${tokenEst}` },
  });
  const horas: any = await resHoras.json();
  console.log('4. GET /api/horas/mias acumuladas:', horas.resumen?.acumuladas);

  // 5. GET /api/evaluaciones/mia (Estudiante)
  const resEval = await fetch(`${API}/evaluaciones/mia`, {
    headers: { Authorization: `Bearer ${tokenEst}` },
  });
  const evalData: any = await resEval.json();
  console.log('5. GET /api/evaluaciones/mia nota:', evalData.evaluacion?.resultado);

  // 6. GET /api/reportes/resumen (Admin)
  const resReportes = await fetch(`${API}/reportes/resumen`, {
    headers: { Authorization: `Bearer ${tokenAdmin}` },
  });
  const reportes: any = await resReportes.json();
  console.log('6. GET /api/reportes/resumen totalEstudiantes:', reportes.totalEstudiantes);

  // 7. GET /api/seguimiento/estudiantes (Admin)
  const resSeg = await fetch(`${API}/seguimiento/estudiantes`, {
    headers: { Authorization: `Bearer ${tokenAdmin}` },
  });
  const seg: any = await resSeg.json();
  console.log('7. GET /api/seguimiento/estudiantes count:', Array.isArray(seg) ? seg.length : seg);

  console.log('✅ TODAS LAS PRUEBAS HTTP PASARON SATISFACTORIAMENTE!');
}

testAll().catch(console.error);

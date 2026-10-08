import 'dotenv/config';
import { MedabotRepository } from './repositories/medabot.repository.js';
import { pool } from './db/index.js';

const repo = new MedabotRepository();

/**
 * Helper para "pausar" el script y que puedas ir a Neon
 * a ver el estado de la tabla antes de la siguiente operación.
 */
async function pause(ms = 3000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('\n🧪 LABORATORIO DE PERSISTENCIA — MEDABOTS\n');

  // ─────────────────────────────────────────────
  // 1. CREATE
  // ─────────────────────────────────────────────
  console.log('📝 [1] CREATE — Insertando un nuevo Medabot...');
  const nuevo = await repo.create({
    name: 'Metal Beetle',
    medaforce: 'Medaforce (Medalla Rara)',
    type: 'Escarabajo',
    head: 'Beam',
    leftArm: 'Missile',
    rightArm: 'Missile'
  });
  console.log('   ✅ Creado:', nuevo);
  await pause();

  // ─────────────────────────────────────────────
  // 2. FIND ALL
  // ─────────────────────────────────────────────
  console.log('\n📋 [2] FIND ALL — Listando todos los Medabots...');
  const todos = await repo.findAll();
  console.log(`   ✅ Encontrados: ${todos.length}`);
  console.table(todos);
  await pause();

  // ─────────────────────────────────────────────
  // 3. FIND BY ID
  // ─────────────────────────────────────────────
  console.log(`\n🔍 [3] FIND BY ID — Buscando el Medabot con id = ${nuevo.id}...`);
  const encontrado = await repo.findById(nuevo.id);
  console.log('   ✅ Encontrado:', encontrado);
  await pause();

  // ─────────────────────────────────────────────
  // 3b. FIND BY ID — caso "no existe"
  // ─────────────────────────────────────────────
  console.log('\n🔍 [3b] FIND BY ID — Buscando un id inexistente (99999)...');
  const noExiste = await repo.findById(99999);
  console.log('   ✅ Resultado (esperado undefined):', noExiste);
  await pause();

  // ─────────────────────────────────────────────
  // 4. UPDATE
  // ─────────────────────────────────────────────
  console.log(`\n✏️  [4] UPDATE — Modificando el nombre del Medabot id = ${nuevo.id}...`);
  const actualizado = await repo.update(nuevo.id, {
    name: 'Metal Beetle MK-II',
    medaforce: 'Medaforce Mejorada',
  });
  console.log('   ✅ Actualizado:', actualizado);
  await pause();

  // ─────────────────────────────────────────────
  // 4b. UPDATE — caso "no existe"
  // ─────────────────────────────────────────────
  console.log('\n✏️  [4b] UPDATE — Intentando actualizar un id inexistente (99999)...');
  const updateNoExiste = await repo.update(99999, { name: 'Fantasma' });
  console.log('   ✅ Resultado (esperado undefined):', updateNoExiste);
  await pause();

  // ─────────────────────────────────────────────
  // 5. DELETE
  // ─────────────────────────────────────────────
  console.log(`\n🗑️  [5] DELETE — Eliminando el Medabot id = ${nuevo.id}...`);
  const borrado = await repo.delete(nuevo.id);
  console.log('   ✅ Resultado (esperado true):', borrado);
  await pause();

  // ─────────────────────────────────────────────
  // 5b. DELETE — caso "no existe"
  // ─────────────────────────────────────────────
  console.log('\n🗑️  [5b] DELETE — Intentando borrar un id inexistente (99999)...');
  const borradoNoExiste = await repo.delete(99999);
  console.log('   ✅ Resultado (esperado false):', borradoNoExiste);
  await pause();

  // ─────────────────────────────────────────────
  // 6. FIND ALL final
  // ─────────────────────────────────────────────
  console.log('\n📋 [6] FIND ALL — Estado final de la tabla...');
  const finales = await repo.findAll();
  console.log(`   ✅ Total final: ${finales.length}`);
  console.table(finales);

  console.log('\n🏁 Laboratorio terminado.\n');
}

main()
  .catch((err) => {
    console.error('❌ Error en el laboratorio:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
    console.log('🔌 Conexión cerrada.');
  });
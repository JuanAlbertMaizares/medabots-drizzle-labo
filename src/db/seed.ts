import 'dotenv/config';
import { db, pool } from './index.js';
import { medabots, NewMedabot } from './schema.js';

// Definimos los datos a insertar
const medabotsData: NewMedabot[] = [
  {
    name: 'Metabee',
    medaforce: 'Lanzamisiles / Medaforce (Medalla Rara)',
    type: 'Escarabajo Hércules (KBT)',
    head: 'Head Beam',
    leftArm: 'Missile',
    rightArm: 'Missile',
    legs: 'Tank (Dos piernas)',
  },
  {
    name: 'Rokusho',
    medaforce: 'Sable / Medaforce (Medalla Rara)',
    type: 'Escarabajo Ciervo (KWG)',
    head: 'Chanbara Sword',
    leftArm: 'Sword',
    rightArm: 'Sword',
    legs: 'Tank (Dos piernas)',
  },
  {
    name: 'Totalizer',
    medaforce: 'Ráfaga de proyectiles',
    type: 'Tanque / Tortuga',
    head: 'Gatling Gun',
    leftArm: 'Cannon',
    rightArm: 'Cannon',
    legs: 'Tanque (Orugas)',
  },
  {
    name: 'Peppercat',
    medaforce: 'Shock Eléctrico',
    type: 'Gato',
    head: 'Electric Shock',
    leftArm: 'Circular Saw',
    rightArm: 'Circular Saw',
    legs: 'Rápido / Ágil',
  },
  {
    name: 'Sumilidon',
    medaforce: 'Garras de Sable',
    type: 'Tigre Dientes de Sable',
    head: 'Sabre Fang',
    leftArm: 'Sabre Claw',
    rightArm: 'Sabre Claw',
    legs: 'Ágil (Dos piernas)',
  },
];

// Función principal
async function seed() {
  try {
    console.log('🌱 Iniciando seed de Medabots...');

    // Opcional: Limpiar la tabla antes de insertar para evitar duplicados en re-ejecuciones
    // await db.delete(medabots);

    const inserted = await db.insert(medabots).values(medabotsData).returning();
    
    console.log(`✅ Se insertaron ${inserted.length} Medabots:`);
    inserted.forEach((m) => console.log(`   - ${m.name} (ID: ${m.id})`));
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  } finally {
    // Es crucial cerrar el pool para que el script termine
    await pool.end();
    console.log('🔌 Conexión cerrada.');
  }
}

seed();
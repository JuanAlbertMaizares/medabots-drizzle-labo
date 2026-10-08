import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { medabots, type Medabot, type NewMedabot } from '../db/schema.js';

export class MedabotRepository {
  /**
   * Crea un nuevo Medabot y devuelve el registro insertado (con id).
   */
  async create(data: NewMedabot): Promise<Medabot> {
    const [created] = await db.insert(medabots).values(data).returning();
    // `created` es Medabot | undefined por noUncheckedIndexedAccess.
    // Si la inserción falló, Drizzle ya habría lanzado una excepción.
    if (!created) {
      throw new Error('No se pudo crear el Medabot');
    }
    return created;
  }

  /**
   * Devuelve todos los Medabots.
   */
  async findAll(): Promise<Medabot[]> {
    return db.select().from(medabots);
  }

  /**
   * Busca un Medabot por id. Devuelve undefined si no existe.
   */
  async findById(id: number): Promise<Medabot | undefined> {
    const [found] = await db.select().from(medabots).where(eq(medabots.id, id));
    return found;
  }

  /**
   * Actualiza un Medabot por id y devuelve el registro actualizado.
   * Devuelve undefined si el id no existe.
   */
  async update(id: number, data: Partial<NewMedabot>): Promise<Medabot | undefined> {
    const [updated] = await db
      .update(medabots)
      .set(data)
      .where(eq(medabots.id, id))
      .returning();
    return updated;
  }

  /**
   * Elimina un Medabot por id.
   * Devuelve true si eliminó una fila, false si el id no existía.
   */
  async delete(id: number): Promise<boolean> {
    const deleted = await db
      .delete(medabots)
      .where(eq(medabots.id, id))
      .returning({ id: medabots.id });
    return deleted.length > 0;
  }
}
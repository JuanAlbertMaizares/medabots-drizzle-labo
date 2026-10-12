import { MedabotRepository } from '../repositories/medabot.repository.js';
import type { NewMedabot } from '../db/schema.js';

export class MedabotService {
  private repository: MedabotRepository;

  constructor() {
    this.repository = new MedabotRepository();
  }

  async create(data: NewMedabot) {
    // Regla de negocio: Validar que el nombre no esté vacío (Zod ya lo hará, pero es un ejemplo)
    // Regla futura: "un Medabot no puede tener 3 brazos"
    return this.repository.create(data);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findById(id: number) {
    const medabot = await this.repository.findById(id);
    // Lógica de negocio: Si no existe, lanzamos un error específico que el Controller capturará
    if (!medabot) {
      throw new Error('Medabot not found');
    }
    return medabot;
  }

  async update(id: number, data: Partial<NewMedabot>) {
    const updated = await this.repository.update(id, data);
    if (!updated) {
      throw new Error('Medabot not found');
    }
    return updated;
  }

  async delete(id: number) {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new Error('Medabot not found');
    }
    return true;
  }
}
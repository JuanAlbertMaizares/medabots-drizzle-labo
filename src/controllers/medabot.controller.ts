import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { MedabotService } from '../services/medabot.service.js';

// Definimos el esquema de validación con Zod
const medabotSchema = z.object({
  name: z.string().min(1),
  medaforce: z.string().min(1),
  type: z.string().min(1),
  head: z.string().min(1),
  leftArm: z.string().min(1),
  rightArm: z.string().min(1),
  legs: z.string().min(1),
});

export const medabotController = new Hono();
const service = new MedabotService();

// GET /medabots - Listar todos
medabotController.get('/', async (c) => {
  const medabots = await service.findAll();
  return c.json(medabots);
});

// GET /medabots/:id - Obtener uno por ID
medabotController.get('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) return c.json({ error: 'Invalid ID' }, 400);

  try {
    const medabot = await service.findById(id);
    return c.json(medabot);
  } catch (error) {
    return c.json({ error: 'Medabot not found' }, 404);
  }
});

// POST /medabots - Crear nuevo
medabotController.post(
  '/',
  zValidator('json', medabotSchema), // Validación en el borde
  async (c) => {
    const data = c.req.valid('json');
    const newMedabot = await service.create(data);
    return c.json(newMedabot, 201); // 201 Created
  }
);

// PUT /medabots/:id - Actualizar
medabotController.put(
  '/:id',
  zValidator('json', medabotSchema.partial()), // .partial() permite actualizaciones parciales
  async (c) => {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) return c.json({ error: 'Invalid ID' }, 400);

    const data = c.req.valid('json');
    try {
      const updated = await service.update(id, data);
      return c.json(updated);
    } catch (error) {
      return c.json({ error: 'Medabot not found' }, 404);
    }
  }
);

// DELETE /medabots/:id - Eliminar
medabotController.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (isNaN(id)) return c.json({ error: 'Invalid ID' }, 400);

  try {
    await service.delete(id);
    return c.body(null, 204); // 204 No Content
  } catch (error) {
    return c.json({ error: 'Medabot not found' }, 404);
  }
});
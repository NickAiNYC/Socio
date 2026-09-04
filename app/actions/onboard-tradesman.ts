'use server';

import { z } from 'zod';

// Strict schema validation for the intake data
const applicationSchema = z.object({
  nombre: z.string().min(2, 'Name is required'),
  especialidad: z.string().min(2, 'Specialty is required'),
  anosNYC: z.coerce.number().min(0, 'Must be a valid number of years'),
  telefono: z.string().min(10, 'Valid phone number required'),
});

export type ActionState = {
  success: boolean;
  message: string;
} | null;

export async function submitTradesmanApplication(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const rawData = {
      nombre: formData.get('nombre'),
      especialidad: formData.get('especialidad'),
      anosNYC: formData.get('anosNYC'),
      telefono: formData.get('telefono'),
    };

    applicationSchema.parse(rawData);

    // Route to CRM / Postgres / webhook when configured
    // Simulate network latency for premium loading feedback
    await new Promise((resolve) => setTimeout(resolve, 800));

    return { success: true, message: 'Solicitud recibida correctamente.' };
  } catch {
    return { success: false, message: 'Hubo un error al procesar su solicitud.' };
  }
}

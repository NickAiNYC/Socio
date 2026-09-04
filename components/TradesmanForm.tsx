'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitTradesmanApplication } from '@/app/actions/onboard-tradesman';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-6 w-full bg-black text-white font-sans font-medium text-lg py-4 px-6 hover:bg-gray-900 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-3 rounded-none"
    >
      {pending ? 'Enviando...' : 'Enviar Solicitud'}
      {!pending && <span className="font-mono text-sm">→</span>}
    </button>
  );
}

export function TradesmanForm() {
  const [state, formAction] = useActionState(submitTradesmanApplication, null);

  if (state?.success) {
    return (
      <div className="bg-[#FAFAFA] border border-gray-200 p-8 md:p-12 flex flex-col items-center text-center">
        <div className="w-12 h-12 border border-black bg-black text-white flex items-center justify-center mb-6">
          ✓
        </div>
        <h3 className="text-2xl font-serif text-black mb-2">Solicitud Recibida</h3>
        <p className="font-sans text-gray-500">
          Nuestro equipo en Brooklyn revisará su perfil y se pondrá en contacto pronto.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="nombre"
          className="font-mono text-xs uppercase tracking-wide text-gray-500"
        >
          Nombre Completo *
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          required
          className="w-full bg-transparent border-b border-gray-300 rounded-none px-0 py-3 font-sans text-lg text-black focus:outline-none focus:border-black transition-colors"
          placeholder="Ej: Juan Pérez"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="especialidad"
          className="font-mono text-xs uppercase tracking-wide text-gray-500"
        >
          Especialidad *
        </label>
        <input
          type="text"
          id="especialidad"
          name="especialidad"
          required
          className="w-full bg-transparent border-b border-gray-300 rounded-none px-0 py-3 font-sans text-lg text-black focus:outline-none focus:border-black transition-colors"
          placeholder="Ej: Pintura, Plaster, Azulejos"
        />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="anosNYC"
            className="font-mono text-xs uppercase tracking-wide text-gray-500"
          >
            Años en NYC *
          </label>
          <input
            type="number"
            id="anosNYC"
            name="anosNYC"
            required
            min="0"
            className="w-full bg-transparent border-b border-gray-300 rounded-none px-0 py-3 font-sans text-lg text-black focus:outline-none focus:border-black transition-colors"
            placeholder="Ej: 5"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="telefono"
            className="font-mono text-xs uppercase tracking-wide text-gray-500"
          >
            Teléfono (WhatsApp) *
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            required
            className="w-full bg-transparent border-b border-gray-300 rounded-none px-0 py-3 font-sans text-lg text-black focus:outline-none focus:border-black transition-colors"
            placeholder="(xxx) xxx-xxxx"
          />
        </div>
      </div>

      {state?.success === false && (
        <p className="text-red-600 font-sans text-sm">{state.message}</p>
      )}

      <SubmitButton />
    </form>
  );
}

export default TradesmanForm;

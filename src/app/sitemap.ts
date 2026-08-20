import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://socio.nyc/clinicas',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://socio.nyc/contractors',
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://socio.nyc/contratistas',
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: 'https://socio.nyc/contratistas/casos-de-exito',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://socio.nyc/contratistas/como-funciona',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://socio.nyc/contratistas/preguntas-frecuentes',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://socio.nyc/contratistas/radar-de-permisos',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://socio.nyc/floristas',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://socio.nyc/floristas/casos-de-exito',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://socio.nyc/floristas/como-funciona',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://socio.nyc/floristas/preguntas-frecuentes',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://socio.nyc/floristas/radar-floral',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://socio.nyc/proveedores/equipos',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://socio.nyc/proveedores/ferreterias',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://socio.nyc/proveedores/materiales',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://socio.nyc/restaurantes',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];
}

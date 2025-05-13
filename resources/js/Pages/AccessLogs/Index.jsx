import React from 'react';
import AutoAccess from '@/Components/AutoAccess';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AccessLogMonitor from '@/Components/AccessLogMonitor';
import ProductSalesMonitor from '@/Components/ProductSalesMonitor';

const Index = () => {
  return (
    
  <AuthenticatedLayout>
    <div className="my-4 p-6 max-w-7xl mx-auto bg-white shadow rounded-xl space-y-6">
      <Head title="Accesos Automáticos" />

      {/* Reconocimiento automático (ocupa toda la fila) */}
      <AutoAccess />

      {/* Segunda fila: 2 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna 1: accesos */}
        <AccessLogMonitor />

        {/* Columna 2: ventas */}
        <ProductSalesMonitor />
      </div>
    </div>
  </AuthenticatedLayout>

  );
};

export default Index;

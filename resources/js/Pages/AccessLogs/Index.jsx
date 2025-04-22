import React from 'react';
import AutoAccess from '@/Components/AutoAccess';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Index = () => {
  return (
    <AuthenticatedLayout>
      <div className="my-4 p-6 max-w-5xl mx-auto bg-white shadow rounded-xl space-y-6">
        <Head title="Accesos Automáticos" />
        <AutoAccess />
      </div>
  </AuthenticatedLayout>

  );
};

export default Index;

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function ProductSalesMonitor() {
    const [sales, setSales] = useState([]);

    const fetchSales = async () => {
        try {
            const res = await axios.get('/api/product-sales');
            setSales(res.data);
        } catch (err) {
            console.error('Error al cargar ventas', err);
        }
    };

    useEffect(() => {
        fetchSales();
        const interval = setInterval(fetchSales, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">🛒 Historial de ventas</h2>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm max-h-[500px] overflow-y-auto p-4">
                <ul className="divide-y divide-gray-200">
                    {sales.map(sale => {
                        const cliente = sale.membership?.client;
                        const tipo = sale.membership?.membership_type;
                        const producto = sale.product;

                        return (
                            <li key={sale.id} className="py-3">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">🧍 {cliente?.name || 'Desconocido'}</p>
                                        <p className="text-xs text-gray-500">
                                            Membresía: <strong>{tipo?.name || '---'}</strong>
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Producto: <strong>{producto?.name || '---'}</strong> × {sale.quantity}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Total: <strong>${parseFloat(sale.total).toFixed(2)}</strong>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block text-sm font-semibold px-2 py-1 rounded ${sale.paid
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'}`}>
                                            {sale.paid ? 'Pagado' : 'Pendiente'}
                                        </span>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(sale.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

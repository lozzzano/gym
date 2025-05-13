import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AccessLogMonitor() {
    const [logs, setLogs] = useState([]);

    const fetchLogs = async () => {
        try {
            const res = await axios.get('/api/access-logs');
            setLogs(res.data);
        } catch (err) {
            console.error('Error cargando logs', err);
        }
    };

    useEffect(() => {
        fetchLogs();
        const interval = setInterval(fetchLogs, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">📋 Historial de accesos recientes</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm max-h-[500px] overflow-y-auto p-4">
                <ul className="divide-y divide-gray-200">
                    {logs.map(log => {
                        const cliente = log.client;
                        const membresia = cliente?.membership;
                        const tipo = membresia?.membership_type;

                        return (
                            <li key={log.id} className="py-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            🧍 {cliente?.name || 'Desconocido'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Membresía: <strong>{tipo?.name || '---'}</strong>
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Entrada: <strong>{new Date(log.access_time).toLocaleTimeString()}</strong>
                                            {`  |  `}
                                            Salida: <strong>{log.checkout ? new Date(log.checkout).toLocaleTimeString() : '---'}</strong>
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block text-sm font-semibold px-2 py-1 rounded ${log.status === 'allowed'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'}`}>
                                            {log.status === 'allowed' ? 'Permitido' : 'Denegado'}
                                        </span>
                                        {log.reason && (
                                            <p className="text-xs text-red-500 mt-1">📌 {log.reason}</p>
                                        )}
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

import React, { useState, useEffect } from "react";
import axios from "axios";

export default function PaymentForm({ onSubmit }) {
    const [form, setForm] = useState({
        client_id: "",
        membership_id: "",
        amount: "",
        payment_method: "",
        reference: "",
        payment_date: "",
        image: null,
    });

    const [query, setQuery] = useState("");
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(() => {
        if (query.length >= 2) {
            axios.get(`/api/payments/search-client?term=${query}`)
                .then(res => setClients(res.data))
                .catch(() => setClients([]));
        } else {
            setClients([]);
        }
    }, [query]);

    useEffect(() => {
        if (selectedClient) {
            axios.get(`/api/payments/client-membership/${selectedClient.id}`)
                .then(res => {
                    setForm(prev => ({
                        ...prev,
                        client_id: selectedClient.id,
                        membership_id: res.data.id || ""
                    }));
                })
                .catch(() => {
                    setForm(prev => ({
                        ...prev,
                        client_id: selectedClient.id,
                        membership_id: ""
                    }));
                });
        }
    }, [selectedClient]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({ ...form, [name]: files ? files[0] : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        for (const key in form) {
            data.append(key, form[key]);
        }
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                placeholder="Buscar cliente"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border w-full px-3 py-2"
            />

            {clients.length > 0 && (
                <ul className="bg-white border rounded max-h-40 overflow-y-auto">
                    {clients.map(client => (
                        <li
                            key={client.id}
                            onClick={() => {
                                setSelectedClient(client);
                                setQuery(client.name);
                                setClients([]);
                            }}
                            className="cursor-pointer hover:bg-gray-100 px-3 py-1"
                        >
                            {client.name} - {client.birthdate}
                        </li>
                    ))}
                </ul>
            )}

            {selectedClient && (
                <>
                    <p className="text-gray-700 text-sm">
                        Cliente: <strong>{selectedClient.name}</strong>
                    </p>

                    <input name="amount" type="number" placeholder="Monto" onChange={handleChange} required className="border w-full px-3 py-2" />
                    <input name="payment_method" placeholder="Método de pago" onChange={handleChange} required className="border w-full px-3 py-2" />
                    <input name="reference" placeholder="Referencia" onChange={handleChange} className="border w-full px-3 py-2" />
                    <input name="payment_date" type="date" onChange={handleChange} required className="border w-full px-3 py-2" />
                    <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full" />

                    <button type="submit" className="bg-green-500 rounded text-white px-4 py-2">Guardar Pago</button>
                </>
            )}
        </form>
    );
}

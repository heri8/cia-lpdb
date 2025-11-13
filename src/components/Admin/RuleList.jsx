// src/components/Admin/RuleList.jsx

import React from "react";

const RuleList = ({ rules, onEdit, onShow }) => {
    return (
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 mb-8">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                                Kode
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-5/12">
                                Nama Variabel (Rule)
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                                Bobot U
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                                Bobot SR
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                                Bobot SP
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                                Skala Rule
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {rules.map((rule) => (
                            <tr key={rule.id} className="hover:bg-gray-50 transition">
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className="font-semibold text-gray-800">{rule.variabel_kode}</span>
                                </td>
                                <td className="px-4 py-4">
                                    <p className="text-sm text-gray-900">{rule.nama_variabel}</p>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <code className="text-sm bg-blue-50 px-2 py-1 rounded">{parseFloat(rule.bobot_u).toFixed(2)}</code>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <code className="text-sm bg-yellow-50 px-2 py-1 rounded">{parseFloat(rule.bobot_sr).toFixed(2)}</code>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <code className="text-sm bg-yellow-50 px-2 py-1 rounded">{parseFloat(rule.bobot_sp).toFixed(2)}</code>
                                </td>
                                <td className="px-4 py-4">
                                    <ul className="text-xs text-gray-600 space-y-1">
                                        {[...rule.skala_rules].sort((a, b) => b.skala_dihasilkan - a.skala_dihasilkan).slice(0, 3).map(skala => (
                                            <li key={skala.id}>
                                                <span className="font-medium text-blue-600 mr-1">{skala.skala_dihasilkan}</span>: {skala.label_skala}
                                            </li>
                                        ))}
                                        {rule.skala_rules.length > 3 && <li className="text-gray-400">...{rule.skala_rules.length - 3} skala lainnya</li>}
                                    </ul>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-right">
                                    {/* <button
                                        onClick={() => onEdit(rule)}
                                        className="text-yellow-600 hover:text-yellow-800 font-medium p-2 rounded-lg hover:bg-yellow-50 transition"
                                    >
                                        <i className="fas fa-edit mr-1"></i> Edit
                                    </button> */}
                                    
                                    {/* Tombol Lihat: memicu onShow di komponen induk */}
                                    <button
                                        onClick={() => onShow(rule)}
                                        className="text-blue-600 hover:text-blue-800 font-medium p-2 rounded-lg hover:bg-blue-50 transition"
                                    >
                                        <i className="fas fa-search mr-1"></i> Lihat
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {rules.length === 0 && (
                <div className="p-10 text-center text-gray-500">
                    Tidak ada aturan scoring yang ditemukan.
                </div>
            )}
        </div>
    );
};

export default RuleList;
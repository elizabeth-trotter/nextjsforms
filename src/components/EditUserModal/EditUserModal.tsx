'use client'
import React, { useState } from 'react';
import { IForm } from '@/Interfaces/Interface';

interface Props {
    user: IForm;
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: IForm) => void;
}

const EditUserModal: React.FC<Props> = ({ user, isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<IForm>(user);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Edit User</h2>
                <form onSubmit={handleSubmit}>
                    {Object.keys(formData).map((key) => (
                        <div key={key} className="mb-4">
                            <label className="block text-gray-700 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                            <input
                                type={key === 'email' ? 'email' : key === 'dob' ? 'date' : 'text'}
                                name={key}
                                value={formData[key as keyof IForm]}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                            />
                        </div>
                    ))}
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;

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
        <div style={{ position: 'fixed', top: '20%', left: '30%', background: 'white', padding: '20px', zIndex: 1000 }}>
            <form onSubmit={handleSubmit}>
                {Object.keys(formData).map((key) => (
                    <div key={key}>
                        <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                        <input
                            type={key === 'email' ? 'email' : key === 'dob' ? 'date' : 'text'}
                            name={key}
                            value={formData[key as keyof IForm]}
                            onChange={handleChange}
                        />
                    </div>
                ))}
                <button type="submit">Save Changes</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    );
};

export default EditUserModal;

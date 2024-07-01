'use client'
import React, { useEffect, useState, useMemo } from 'react';
import { useTable, useSortBy, Column, Row } from 'react-table';
import EditUserModal from '@/components/EditUserModal/EditUserModal';
import { IForm, IToken } from '@/Interfaces/Interface';
import { notFound, useRouter } from 'next/navigation';

const ManagementPage = () => {
    const [users, setUsers] = useState<IForm[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<IForm | null>(null);

    const [data, setData] = useState<any>(null);

    const router = useRouter()

    const fetchUsers = async () => {
        const response = await fetch('https://williamform.azurewebsites.net/User/GetAllUsers');
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }
        return await response.json();
    };

    useEffect(() => {
        fetchUsers().then(setUsers).catch(console.error);
        const session = sessionStorage.getItem("WA-SessionStorage");
        setData(session ? JSON.parse(session) : null)
    }, []);

    const columns: Column<IForm>[] = useMemo(() => [
        { Header: 'Email', accessor: 'email' },
        { Header: 'First Name', accessor: 'firstName' },
        { Header: 'Last Name', accessor: 'lastName' },
        { Header: 'Date of Birth', accessor: 'dob' },
        // { Header: 'Address', accessor: 'address' },
        // { Header: 'Phone Number', accessor: 'phonenumber' },
        {
            Header: 'Actions',
            id: 'actions',
            Cell: ({ row }: { row: Row<IForm> }) => (
                <div className="flex space-x-2">
                    <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                        onClick={() => openEditModal(row.original)}
                    >
                        Edit
                    </button>
                    <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                        onClick={() => console.log('Delete', row.original)}
                    >
                        Delete
                    </button>
                </div>
            )
        }
    ], []);

    const tableInstance = useTable({ columns, data: users }, useSortBy);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    const openEditModal = (user: IForm) => {
        setCurrentUser(user);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
    };

    const saveUser = async (user: IForm) => {
        console.log('Saving user:', user);
        closeEditModal();
    };

    const CheckToken = () => {
        
        let result = false;

        if (data.token != null) {
            result = true;
        }

        return result;
    }

    if (CheckToken()) {
        if (!data.isAdmin) {
            return notFound()
        }
    } else {
        router.push('/')
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User Management</h1>
            <table {...getTableProps()} className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-100">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                            {headerGroup.headers.map(column => (
                                <th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    key={column.id}
                                    className="px-4 py-2 border-b border-gray-200 text-left text-gray-600 text-sm font-medium"
                                >
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} key={row.id} className="hover:bg-gray-50">
                                {row.cells.map(cell => (
                                    <td
                                        {...cell.getCellProps()}
                                        key={cell.column.id}
                                        className="px-4 py-2 border-b border-gray-200 text-gray-700"
                                    >
                                        {cell.render('Cell')}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {currentUser && (
                <EditUserModal
                    user={currentUser}
                    isOpen={isEditModalOpen}
                    onClose={closeEditModal}
                    onSave={saveUser}
                />
            )}
        </div>
    );
};

export default ManagementPage;

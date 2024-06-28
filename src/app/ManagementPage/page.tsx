'use client'
import React, { useEffect, useState, useMemo } from 'react';
import { useTable, useSortBy, Column, Row } from 'react-table';
import EditUserModal from '@/components/EditUserModal/EditUserModal';
import { IForm } from '@/Interfaces/Interface';

const ManagementPage = () => {
    const [users, setUsers] = useState<IForm[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<IForm | null>(null);

    const fetchUsers = async () => {
        const response = await fetch('https://williamform.azurewebsites.net/User/GetAllUsers');
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }
        return await response.json();
    };

    useEffect(() => {
        fetchUsers().then(setUsers).catch(console.error);
    }, []);

    const columns: Column<IForm>[] = useMemo(() => [
        { Header: 'Email', accessor: 'email' },
        { Header: 'First Name', accessor: 'firstname' },
        { Header: 'Last Name', accessor: 'lastname' },
        { Header: 'Date of Birth', accessor: 'dob' },
        { Header: 'Address', accessor: 'address' },
        { Header: 'Phone Number', accessor: 'phonenumber' },
        {
            Header: 'Actions',
            id: 'actions',
            Cell: ({ row }: { row: Row<IForm> }) => (
                <div>
                    <button onClick={() => console.log('Edit', row.original)}>Edit</button>
                    <button onClick={() => console.log('Delete', row.original)}>Delete</button>
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

    return (
        <div>
            <h1>User Management</h1>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup, headerGroupIndex) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={`headerGroup-${headerGroupIndex}`}>
                            {headerGroup.headers.map((column, columnIndex) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())} key={`column-${columnIndex}`}>
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
                    {rows.map((row, rowIndex) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} key={`row-${rowIndex}`}>
                                {row.cells.map((cell, cellIndex) => (
                                    <td {...cell.getCellProps()} key={`cell-${cellIndex}`}>{cell.render('Cell')}</td>
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

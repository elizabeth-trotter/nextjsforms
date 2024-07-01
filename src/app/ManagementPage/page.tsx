'use client'
import React, { useEffect, useState, useMemo } from 'react'; 
import { useTable, useSortBy, Column, Row } from 'react-table';
import EditUserModal from '@/components/EditUserModal/EditUserModal'; // EditUserModal component
import { IForm } from '@/Interfaces/Interface'; 
import { notFound, useRouter } from 'next/navigation';

const ManagementPage = () => {
    // State to store user data
    const [users, setUsers] = useState<IForm[]>([]);
    // State to control the visibility of the EditUserModal
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    // State to store the currently selected user for editing
    const [currentUser, setCurrentUser] = useState<IForm | null>(null);
    // State to store session data
    const [data, setData] = useState<any>(null);

    const router = useRouter(); // Initialize router for navigation

    // Function to fetch user data from the API
    const fetchUsers = async () => {
        const response = await fetch('https://williamform.azurewebsites.net/User/GetAllUsers');
        if (!response.ok) {
            throw new Error('Failed to fetch'); // Throw an error if the fetch fails
        }
        const usersData = await response.json();
        setUsers(usersData); // Update the users state with the fetched data
    };

    // useEffect hook to fetch users and session data when the component mounts
    useEffect(() => {
        fetchUsers().catch(console.error); // Fetch users and handle any errors
        const session = sessionStorage.getItem("WA-SessionStorage"); // Get session data from sessionStorage
        setData(session ? JSON.parse(session) : null); // Parse and set session data
    }, []);

    // Function to handle saving a user
    const handleUserSave = async (updatedUser: IForm) => {
        await fetchUsers(); // Refetch users to update the list
        setCurrentUser(null); // Clear the current user
        setEditModalOpen(false); // Close the modal
    };

    // Define the table columns
    const columns: Column<IForm>[] = useMemo(() => [
        { Header: 'Email', accessor: 'email' },
        { Header: 'First Name', accessor: 'firstName' },
        { Header: 'Last Name', accessor: 'lastName' },
        { Header: 'Date of Birth', accessor: 'dob' },
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

    // Initialize the table instance
    const tableInstance = useTable({ columns, data: users }, useSortBy);

    // Destructure properties from the table instance
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    // Function to open the EditUserModal
    const openEditModal = (user: IForm) => {
        setCurrentUser(user); // Set the selected user
        setEditModalOpen(true); // Open the modal
    };

    // Function to close the EditUserModal
    const closeEditModal = async () => {
        setEditModalOpen(false); // Close the modal
        setCurrentUser(null); // Clear the current user
        await fetchUsers(); // Refetch users to update the list
    };

    // Function to check if the user has a valid token
    const CheckToken = () => {
        let result = false;

        if (data != null && data.token != null) {
            result = true; // Token is valid
        }

        return result;
    };

    // If the user does not have a valid token or is not an admin, redirect or show not found
    if (CheckToken()) {
        if (data != null && !data.isAdmin) {
            return notFound(); // Show not found if the user is not an admin
        }
    } else {
        router.push('/'); // Redirect to home if the token is invalid
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
                    onSave={handleUserSave}
                />
            )}
        </div>
    );
};

export default ManagementPage;

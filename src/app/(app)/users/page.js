"use client";

import Header from '@/app/(app)/Header'
import UserList from "./userList";
import Link from 'next/link';

// export const metadata = {
//     title: 'PayMarSU - Users',
// }

const Users = () => {
    return (
        <>
        <Header title="Users" />
        <div className="py-6">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                            <div>
                                List of Users from Student Organizations
                            </div>
                            <div className="flex place-content-end">
                                <Link href="/addUser" className="inline-flex items-center px-4 py-1 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-yellow-800 border border-transparent rounded-md hover:bg-yellow-700 active:bg-yellow-900 focus:outline-none focus:border-yellow-900 focus:ring ring-yellow-300 disabled:opacity-25">
                                    Add New
                                </Link>
                            </div>
                        </div>
                        <UserList />
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Users
import { useEffect, useState } from 'react'
import { useUsers } from '@/hooks/user'
import Link from 'next/link'

const UserList = () => {
    const { users, error } = useUsers({
        middleware: 'auth:sanctum',
    })

    useEffect(() => {
        console.log(users)
    }, [users, error])

    return (
        <table className="min-w-full w-full border-collapse border border-slate-400 divide-y divide-gray-200">
            <thead>
            <tr>
                <th className="border border-slate-300 px-6 py-2 bg-gray-50">
                    <span className="text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase">Name</span>
                </th>
                <th className="border border-slate-300 px-6 py-2 bg-gray-50">
                    <span className="text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase">Email</span>
                </th>
                <th className="border border-slate-300 px-6 py-2 bg-gray-50">
                    <span className="text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase">College</span>
                </th>
                <th className="border border-slate-300 px-6 py-2 bg-gray-50">
                    <span className="text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase">Student Org Name</span>
                </th>           
                <th className="border border-slate-300 px-6 py-2 bg-gray-50">
                    <span className="text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase">Actions</span>
                </th>
            </tr>
            </thead>
            {users?.length > 0 ? (
                <>
                {users?.map((value) => (
                    <tr key={value.id}>
                        <td className="border border-slate-300 px-6 py-2 text-md leading-5 text-gray-900 whitespace-no-wrap">
                            <span >{ value.first_name+' '+value.last_name }</span>
                        </td>
                        <td className="border border-slate-300 px-6 py-2 text-md leading-5 text-gray-900 whitespace-no-wrap">
                            <span >{ value.email }</span>
                        </td>
                        <td className="border border-slate-300 px-6 py-2 text-md leading-5 text-gray-900 whitespace-no-wrap">
                            <span >{ value.college_name }</span>
                        </td>
                        <td className="border border-slate-300 px-6 py-2 text-md leading-5 text-gray-900 whitespace-no-wrap">
                            <span >{ value.org_name }</span>
                        </td>
                        <td className="border border-slate-300 px-6 py-2 text-md leading-5 text-gray-900 whitespace-no-wrap text-center">
                            <Link href={`/users/${value.id}`} className="inline-flex items-center px-4 py-1 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-yellow-800 border border-transparent rounded-md hover:bg-yellow-700 active:bg-yellow-900 focus:outline-none focus:border-yellow-900 focus:ring ring-yellow-300 disabled:opacity-25">
                                Edit
                            </Link>
                        </td>
                    </tr>
                ))}
                
                </>
            ) : (
                <></>
            ) }
            <tbody className="bg-white divide-y divide-gray-200 divide-solid">
            </tbody>
        </table>
    )
    
}

export default UserList
"use client";

import { useEffect, useState } from 'react'
import Header from '@/app/(app)/Header'
import Link from 'next/link';
import { usePaymentCategories } from "@/hooks/paymentcategory"

// export const metadata = {
//     title: 'PayMarSU - Users',
// }

const PaymentCategories = () => {

    const { paymentcategories, error } = usePaymentCategories({
        middleware: 'auth:sanctum',
    })

    useEffect(() => {
        console.log(paymentcategories)
    }, [paymentcategories, error])

    return (
        <>
        <Header title="Payment Categories" />
        <div className="py-6">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                            <div>
                                List of Payment Categories
                            </div>
                            <div className="flex place-content-end">
                                <Link href="/paymentcategoriesAdd" className="inline-flex items-center px-4 py-1 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-yellow-800 border border-transparent rounded-md hover:bg-yellow-700 active:bg-yellow-900 focus:outline-none focus:border-yellow-900 focus:ring ring-yellow-300 disabled:opacity-25">
                                    Add New
                                </Link>
                            </div>
                        </div>
                        <table className="min-w-full w-full border-collapse border border-slate-400 divide-y divide-gray-200">
                            <thead>
                            <tr>
                                <th className="border border-slate-300 px-6 py-2 bg-gray-50">
                                    <span className="text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase">Category</span>
                                </th>
                                <th className="border border-slate-300 px-6 py-2 bg-gray-50">
                                    <span className="text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase">Description</span>
                                </th>         
                                <th className="border border-slate-300 px-6 py-2 bg-gray-50">
                                    <span className="text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase">Actions</span>
                                </th>
                            </tr>
                            </thead>
                            {paymentcategories?.length > 0 ? (
                                <>
                                {paymentcategories?.map((value) => (
                                    <tr key={value.id}>
                                        <td className="border border-slate-300 px-6 py-2 text-md leading-5 text-gray-900 whitespace-no-wrap">
                                            <span >{ value.category }</span>
                                        </td>
                                        <td className="border border-slate-300 px-6 py-2 text-md leading-5 text-gray-900 whitespace-no-wrap">
                                            <span >{ value.description }</span>
                                        </td>
                                        <td className="border border-slate-300 px-6 py-2 text-md leading-5 text-gray-900 whitespace-no-wrap text-center">
                                            <Link href={`/paymentcategories/${value.id}`} className="inline-flex items-center px-4 py-1 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-yellow-800 border border-transparent rounded-md hover:bg-yellow-700 active:bg-yellow-900 focus:outline-none focus:border-yellow-900 focus:ring ring-yellow-300 disabled:opacity-25">
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                
                                </>
                            ) : (
                                <></>
                            ) }
                        </table>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default PaymentCategories
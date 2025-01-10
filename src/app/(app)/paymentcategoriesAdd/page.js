"use client";

import { useState, useEffect } from "react";
import useSWR from 'swr'
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from '@/app/(app)/Header'
import Link from 'next/link';
import Button from "@/components/Button";
import Input from '@/components/Input';
import InputError from '@/components/InputError';
import Label from '@/components/Label';
import TextArea from "@/components/TextArea";
import { usePaymentCategories } from "@/hooks/paymentcategory"

// export const metadata = {
//     title: 'PayMarSU - Users',
// }

const PaymentCategoriesAdd = () => {
    const router = useRouter();

    const { savePaymentCategory } = usePaymentCategories({
        middleware: 'auth',
    })

    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [errors, setErrors] = useState([])

    const submitForm = event => {
        event.preventDefault()
        
        try {
            savePaymentCategory({
                category,
                description,
                setErrors,
            })
            toast.success("Category successfully saved!");
            router.push("/paymentcategories");
        } catch (e) {
            console.log(e);
            toast.error("Something went wrong! Please try again.");
        }
    }

    return (
        <>
        <Header title="Payment Categories" />
        <div className="py-6">
            <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                            <div>
                                Add New Payment Category
                            </div>
                            <div className="flex place-content-end">
                                <Link href="/paymentcategories" className="inline-flex items-center px-4 py-1 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-800 border border-transparent rounded-md hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25">
                                    Back
                                </Link>
                            </div>
                        </div>
                        <form onSubmit={submitForm}>
                            <div>
                                <Label htmlFor="category">Category<span className="text-red-500">*</span></Label>
                                <Input
                                    id="category"
                                    type="text"
                                    value={category}
                                    className="block mt-1 w-full"
                                    onChange={event => setCategory(event.target.value)}
                                    required
                                    autoFocus
                                />

                                <InputError messages={errors.category} className="mt-2" />
                            </div>
                            <div className="mt-4">
                                <Label htmlFor="description">Description<span className="text-red-500">*</span></Label>
                                <TextArea
                                id="desciption"
                                className="block mt-1 w-full"
                                value={description}
                                onChange={event => setDescription(event.target.value)}
                                rows="5"
                                />
                                <InputError messages={errors.description} className="mt-2" />
                            </div>
                            <div className="flex items-center justify-end mt-4">
                                <Button type="submit" className="ml-4">Save</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default PaymentCategoriesAdd
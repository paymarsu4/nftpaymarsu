"use client"

import { useEffect } from 'react'
import Header from '@/app/(app)/Header'
// import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { useUsers } from '@/hooks/user'
// import Printable from '@/components/Printable'

// export const metadata = {
//     title: 'PayMarSU - Users',
// }

const Students = () => {
    const { user } = useAuth({ middleware: 'auth' })
    const { students } = useUsers({
        middleware: 'auth:sanctum',
        college_id: user.college_id
    })

    const printData = students

    const handlePrint = async () => {
        if (printData.length === 0) {
            // console.log("No data to print")
            return
        }
        // Create a new window for printing
        const printWindow = window.open("", "_blank", "width=800,height=600")

        // Start building the HTML content for the print window with table structure
        let contentToPrint = `
        <html>
        <head>
            <title>List of Students</title>
            <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #f4f4f4; }
            @media print {
                body { font-size: 18px; }
                table { width: 100%; }
            }
            </style>
        </head>
        <body>
            <h3>List of Students</h3>
            <table>
            <thead>
                <tr>
                <th>Student ID No.</th>
                <th>Name</th>
                <th>Email</th>
                </tr>
            </thead>
            <tbody>
        `

        // Loop through the data and add rows to the table
        printData.forEach((item) => {
            contentToPrint += `
            <tr>
                <td>${item.student_id_no}</td>
                <td>${item.first_name+' '+item.last_name}</td>
                <td>${item.email}</td>
            </tr>
            `
        })

        // Close the table and HTML structure
        contentToPrint += `
                </tbody>
                </table>
            </body>
            </html>
        `


        // Add the content to the new window
        printWindow.document.write(contentToPrint)

        // Trigger the print dialog
        printWindow.document.close()
        printWindow.print() // Opens the print dialog
    }

    useEffect(() => {
        // console.log(students)
    }, [students])

    return (
        <>
        <Header title="Students" />
        <div className="py-6">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                            <div>
                                List of Students
                            </div>
                            <div className="flex place-content-end">
                                <button onClick={handlePrint} className="inline-flex items-center px-4 py-1 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-yellow-800 border border-transparent rounded-md hover:bg-yellow-700 active:bg-yellow-900 focus:outline-none focus:border-yellow-900 focus:ring ring-yellow-300 disabled:opacity-25">Print</button>
                            </div>
                        </div>
                        <table className="min-w-full w-full border-collapse border border-slate-400 divide-y divide-gray-200">
                            <thead>
                            <tr>
                                <th className="border border-slate-300 px-6 py-2 bg-gray-50">
                                    <span className="text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase">Student ID No.</span>
                                </th>
                                <th className="border border-slate-300 px-6 py-2 bg-gray-50">
                                    <span className="text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase">Name</span>
                                </th>
                                <th className="border border-slate-300 px-6 py-2 bg-gray-50">
                                    <span className="text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase">Email</span>
                                </th>         
                                <th className="border border-slate-300 px-6 py-2 bg-gray-50">
                                    <span className="text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase">Payment Status</span>
                                </th>           
                                {/* <th className="border border-slate-300 px-6 py-2 bg-gray-50">
                                    <span className="text-sm font-medium leading-4 tracking-wider text-left text-gray-700 uppercase">Actions</span>
                                </th> */}
                            </tr>
                            </thead>
                            
                            <tbody className="bg-white divide-y divide-gray-200 divide-solid">
                            {students?.length > 0 ? (
                                <>
                                {students?.map((value, index) => (
                                    <tr key={index}>
                                        <td className="border border-slate-300 px-6 py-2 text-md leading-5 text-gray-900 whitespace-no-wrap">
                                            <span >{ value.student_id_no }</span>
                                        </td>
                                        <td className="border border-slate-300 px-6 py-2 text-md leading-5 text-gray-900 whitespace-no-wrap">
                                            <span >{ value.first_name+' '+value.last_name }</span>
                                        </td>
                                        <td className="border border-slate-300 px-6 py-2 text-md leading-5 text-gray-900 whitespace-no-wrap">
                                            <span >{ value.email }</span>
                                        </td>
                                        <td className="border border-slate-300 px-6 py-2 text-md leading-5 text-gray-900 whitespace-no-wrap text-center" />
                                        {/* <td className="border border-slate-300 px-6 py-2 text-md leading-5 text-gray-900 whitespace-no-wrap text-center">
                                        </td> */}
                                    </tr>
                                ))}
                                
                                </>
                            ) : (
                                <></>
                            ) }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Students
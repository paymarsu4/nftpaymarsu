"use client"

import { useState, useEffect } from "react";
import useSWR from 'swr'
import { useRouter } from "next/navigation";
import customAxios from "@/lib/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from '@/app/(app)/Header'
import Button from "@/components/Button";
import Input from '@/components/Input';
import InputError from '@/components/InputError';
import Label from '@/components/Label';
import Select from "@/components/Select";
import { useUsers } from "@/hooks/user";

export default function AddUser() {
    const router = useRouter();

    const { generatePassword, saveUser } = useUsers({
        middleware: 'auth',
    })

    const [last_name, setLastName] = useState('')
    const [first_name, setFirstName] = useState('')
    const [college_id, setCollegeId] = useState('')
    const [org_name, setOrgName] = useState('')
    const [org_acronym, setOrgAcronym] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [errors, setErrors] = useState([])

    const { data: colleges, error } = useSWR('/api/colleges/getcolleges', () =>
        customAxios.get('/api/colleges/getcolleges')
            .then(res => res.data)
            .catch(error => {
                console.log(error)
                if (error.response.status !== 409) throw error
            }),
    )

    // useEffect(() => {
    //     console.log(colleges);
    // }, [colleges]);

    useEffect(() => {
        if (college_id && colleges) {
            // Find the selected college using the value property
            const selectedCollege = colleges.find(college => college.value === parseInt(college_id));
    
            // Set the organization name to the label or clear it if not found
            if (selectedCollege) {
                setOrgName(selectedCollege.label || "");
            } else {
                setOrgName("");
            }
        } else {
            setOrgName("");
        }
    }, [college_id, colleges]);

    const generatePass = async (chkbox_fld) => {
        let pw = await generatePassword()
        let chkbox = document.getElementById(chkbox_fld);
        if (chkbox.checked == true) {
            document.getElementById('password').value = pw;
        } else {
            document.getElementById('password').value="";
        }
    }

    const showPass = async (chkbox_fld, passw_fld) => {
        let chkbox = document.getElementById(chkbox_fld);
        if (chkbox.checked == true) {
            document.getElementById(passw_fld).type="text";
        } else{
            document.getElementById(passw_fld).type="password";
        }
    }

    const submitForm = event => {
        event.preventDefault()
        
        try {
            saveUser({
                last_name,
                first_name,
                college_id,
                org_name,
                // org_acronym,
                email,
                password,
                password_confirmation: passwordConfirmation,
                setErrors,
            })
            toast.success("User successfully saved!");
            router.push("/users");
        } catch (e) {
            console.log(e);
            toast.error("Something went wrong! Please try again.");
        }
    }

    return (
        <>
        <Header title="Add New User"/>
        <ToastContainer position="top-center" autoClose="5000" />
        <div className="py-6">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                    <form onSubmit={submitForm}>
                        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
                            <div>
                                {/* Last Name */}
                                <div>
                                    <Label htmlFor="last_name">Org. Secretary Lastname</Label>

                                    <Input
                                        id="last_name"
                                        type="text"
                                        value={last_name}
                                        className="block mt-1 w-full"
                                        onChange={event => setLastName(event.target.value)}
                                        required
                                        autoFocus
                                    />

                                    <InputError messages={errors.last_name} className="mt-2" />
                                </div>

                                {/* First Name */}
                                <div className="mt-4">
                                    <Label htmlFor="first_name">Org. Secretary Firstname</Label>

                                    <Input
                                        id="first_name"
                                        type="text"
                                        value={first_name}
                                        className="block mt-1 w-full"
                                        onChange={event => setFirstName(event.target.value)}
                                        required
                                    />

                                    <InputError messages={errors.first_name} className="mt-2" />
                                </div>

                                {/* College Dropdown */}
                                <div className="mt-4">
                                    <Label htmlFor="college_id">College</Label>
                                    <Select 
                                        id="college_id" 
                                        className="block mt-1 w-full" 
                                        options={colleges}
                                        selectLabel="College"
                                        onChange={event => setCollegeId(event.target.value)} // Trigger college_id update
                                    />
                                    <InputError messages={errors.college_id} className="mt-2" />
                                </div>

                                {/* Organization Name Input */}
                                <div className="mt-4">
                                    <Label htmlFor="org_name">Student Organization Name</Label>
                                    <Input
                                        id="org_name"
                                        type="text"
                                        value={org_name}
                                        className="block mt-1 w-full"
                                        onChange={event => setOrgName(event.target.value)} // Allow manual override if necessary
                                        required
                                    />
                                    <InputError messages={errors.org_name} className="mt-2" />
                                </div>

                                {/* <div className="mt-4">
                                    <Label htmlFor="org_acronym">Org. Acronym</Label>

                                    <Input
                                        id="org_acronym"
                                        type="text"
                                        value={org_acronym}
                                        className="block mt-1 w-full"
                                        onChange={event => setOrgAcronym(event.target.value)}
                                        required
                                    />

                                    <InputError messages={errors.org_acronym} className="mt-2" />
                                </div> */}
                            </div>
                            <div className="">
                                {/* Email Address */}
                                <div className="">
                                    <Label htmlFor="email">Org. Email</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        className="block mt-1 w-full"
                                        onChange={event => setEmail(event.target.value)}
                                        required
                                    />

                                    <InputError messages={errors.email} className="mt-2" />
                                </div>

                                {/* Password */}
                                <div className="mt-4">
                                <div className="flex items-center float-right">
                                    <input id="gen_passw" type="checkbox" className="w-4 h-4 text-indigo-600 bg-white-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onClick={() => generatePass('gen_passw')} />
                                    <label htmlFor="gen_passw" className="ms-1 mr-2 text-sm font-medium">Generate</label>

                                    <input id="show_passw" type="checkbox" className="w-4 h-4 text-indigo-600 bg-white-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onClick={() => showPass('show_passw', 'password')} />
                                    <label htmlFor="show_passw" className="ms-1 text-sm font-medium">Show</label>
                                </div>
                                    <Label htmlFor="password">Password</Label>

                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        className="block mt-1 w-full"
                                        onChange={event => setPassword(event.target.value)}
                                        required
                                        autoComplete="new-password"
                                    />

                                    <InputError messages={errors.password} className="mt-2" />
                                </div>

                            </div>
                        </div>
                        <div className="flex items-center justify-end mt-4">
                            <Button type="submit" className="ml-4">Submit</Button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
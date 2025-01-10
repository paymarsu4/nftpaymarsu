"use client"

import { useState, useEffect } from "react";
import useSWR from 'swr'
import { useRouter, useParams } from "next/navigation";
import customAxios from "@/lib/axios";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from '@/app/(app)/Header'
import Button from "@/components/Button";
import Input from '@/components/Input';
import InputError from '@/components/InputError';
import Label from '@/components/Label';
import Select from "@/components/Select";
import { useUsers } from "@/hooks/user";

export default function UserEdit() {
    const router = useRouter();
    const params = useParams();
    const user_id = params.userId;

    const { user, generatePassword, updateUser } = useUsers({
        middleware: "auth:sanctum",
        user_id: user_id,
    });

    const [last_name, setLastName] = useState("");
    const [first_name, setFirstName] = useState("");
    const [college_id, setCollegeId] = useState("");
    const [org_name, setOrgName] = useState("");
    const [originalOrgName, setOriginalOrgName] = useState(""); // Store original org_name
    const [originalCollegeId, setOriginalCollegeId] = useState(""); // Store original college_id
    const [org_acronym, setOrgAcronym] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [errors, setErrors] = useState([]);
    const [isCollegeChanged, setIsCollegeChanged] = useState(false); // Track manual change

    const { data: colleges } = useSWR("/api/colleges/getcolleges", () =>
        customAxios
        .get("/api/colleges/getcolleges")
        .then((res) => res.data)
        .catch((error) => {
            if (error.response.status !== 409) throw error;
        })
    );

    // Populate user data on load
    useEffect(() => {
        if (user) {
        setLastName(user.last_name || "");
        setFirstName(user.first_name || "");
        setCollegeId(user.college_id || "");
        setOrgName(user.org_name || ""); // Retain original org_name
        setOriginalOrgName(user.org_name || ""); // Store original org_name
        setOriginalCollegeId(user.college_id || ""); // Store original college_id
        setOrgAcronym(user.org_acronym || "");
        setEmail(user.email || "");
        }
    }, [user]);

    useEffect(() => {
        if (colleges) {
            if (college_id === originalCollegeId) {
                // Reset to the original org_name if the same college_id is selected
                setOrgName(originalOrgName);
            } else if (isCollegeChanged) {
                // Update org_name only if college_id has explicitly changed
                const selectedCollege = colleges.find(
                    (college) => college.value === parseInt(college_id)
                );
                if (selectedCollege) {
                    setOrgName(selectedCollege.label);
                } else {
                    setOrgName(""); // Clear if no matching college is found
                }
            }
        }
    }, [college_id, colleges, originalCollegeId, originalOrgName, isCollegeChanged]);
        
    const showPass = async (chkbox_fld, passw_fld) => {
        let chkbox = document.getElementById(chkbox_fld);
        if (chkbox.checked == true) {
            document.getElementById(passw_fld).type="text";
        } else{
            document.getElementById(passw_fld).type="password";
        }
    }
    
    const handleCollegeChange = (value) => {
        if (value === originalCollegeId) {
            setIsCollegeChanged(false); // No change needed
        } else {
            setIsCollegeChanged(true); // Flag that a change occurred
        }
        setCollegeId(value); // Update the state
    };

    const submitForm = (event) => {
        event.preventDefault();

        try {
        updateUser({
            user_id: user_id,
            last_name,
            first_name,
            college_id,
            org_name,
            // org_acronym,
            email,
            password,
            // password_confirmation: passwordConfirmation,
            setErrors,
        });

        if (errors.length === 0) {
            toast.success("User successfully updated!");
            router.push("/users");
        }
        } catch (e) {
        console.error(e);
        toast.error("Something went wrong! Please try again.");
        }
    };

    return (
        <>
        <Header title="Edit User"/>
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

                                {/* College */}
                                <div className="mt-4">
                                    <Label htmlFor="college_id">College</Label>

                                    {/* <Select options={options} required id="college_id" onChange={event => setCollegeId(event.target.value)}/> */}
                                    <Select 
                                        id="college_id" 
                                        className="block mt-1 w-full" 
                                        options={colleges}
                                        selectLabel="College"
                                        value={college_id}
                                        onChange={(event) => handleCollegeChange(event.target.value)}
                                    />

                                    <InputError messages={errors.college_id} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <Label htmlFor="org_name">Student Organization Name</Label>

                                    <Input
                                        id="org_name"
                                        type="text"
                                        value={org_name}
                                        className="block mt-1 w-full"
                                        onChange={(event) => setOrgName(event.target.value)}
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
                                    <input id="gen_passw" type="checkbox" className="w-4 h-4 text-indigo-600 bg-white-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onClick={() => generatePassword('gen_passw')} />
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
                                        autoComplete="new-password"
                                    />

                                    <InputError messages={errors.password} className="mt-2" />

                                    <small className="text-blue-500">Leave the password field empty if not going to change the password.</small>
                                </div>

                            </div>
                        </div>
                        <div className="flex items-center justify-end mt-4">
                                <Link href="/users" className="inline-flex items-center px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-gray-800 border border-transparent rounded-md hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25">
                                    Cancel
                                </Link>
                            <Button type="submit" className="ml-2">Save Changes</Button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
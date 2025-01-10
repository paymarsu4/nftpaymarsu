'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Link from 'next/link'
// import Select from 'react-select'
import Select from '@/components/Select'
import { useAuth } from '@/hooks/auth'
import { useState, useEffect } from 'react'
import { useColleges } from '@/hooks/college'

const Page = () => {
    const { register } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [last_name, setLastName] = useState('')
    const [first_name, setFirstName] = useState('')
    const [student_id_no, setStudentId] = useState('')
    const [college_id, setCollegeId] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [errors, setErrors] = useState([])

    const {colleges, error} = useColleges()

    // useEffect(() => {
    //     console.log(colleges, "abs")
    //     setDatas(colleges)
    // }, [colleges])
    console.log(colleges)

    const submitForm = event => {
        event.preventDefault()

        register({
            last_name,
            first_name,
            student_id_no,
            college_id,
            email,
            password,
            password_confirmation: passwordConfirmation,
            setErrors,
        })
    }

    return (
        <form onSubmit={submitForm}>
            {/* Last Name */}
            <div>
                <Label htmlFor="last_name">Lastname</Label>

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
                <Label htmlFor="first_name">Firstname</Label>

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

            {/* Student ID Number */}
            <div className="mt-4">
                <Label htmlFor="student_id_no">Student ID Number </Label>

                <Input
                    id="student_id_no"
                    type="text"
                    value={student_id_no}
                    className="block mt-1 w-full"
                    onChange={event => setStudentId(event.target.value)}
                    required
                />

                <InputError messages={errors.student_id_no} className="mt-2" />
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
                    onChange={event => setCollegeId(event.target.value)}
                />

                <InputError messages={errors.first_name} className="mt-2" />
            </div>

            {/* Email Address */}
            <div className="mt-4">
                <Label htmlFor="email">Email</Label>

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

            {/* Confirm Password */}
            <div className="mt-4">
                <Label htmlFor="passwordConfirmation">
                    Confirm Password
                </Label>

                <Input
                    id="passwordConfirmation"
                    type="password"
                    value={passwordConfirmation}
                    className="block mt-1 w-full"
                    onChange={event =>
                        setPasswordConfirmation(event.target.value)
                    }
                    required
                />

                <InputError
                    messages={errors.password_confirmation}
                    className="mt-2"
                />
            </div>

            <div className="flex items-center justify-end mt-4">
                <Link
                    href="/login"
                    className="underline text-sm text-gray-600 hover:text-gray-900">
                    Already registered?
                </Link>

                <Button className="ml-4">Register</Button>
            </div>
        </form>
    )
}

export default Page

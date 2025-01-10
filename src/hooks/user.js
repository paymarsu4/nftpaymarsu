import useSWR from 'swr'
import customAxios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export const useUsers = ({ middleware, ...props } = {}) => {
    const router = useRouter()
    const params = useParams()
    // console.log(props)

    const { data: users, error, mutate } = useSWR('/api/users', () =>
        customAxios.get('/api/users') 
            .then(res => res.data)
            .catch(error => {
                console.log(error)
                if (error.response.status !== 409) throw error
            })
    )

    const { data: user } = useSWR(`/api/users/show/${props.user_id}`, () =>
        customAxios.get(`/api/users/show/${props.user_id}`, props) 
            .then(res => res.data)
            .catch(error => {
                console.log(error)
                if (error.response.status !== 409) throw error
            })
    )

    const { data: students } = useSWR(`/api/users/students/${props.college_id}`, () =>
        customAxios.get(`/api/users/students/${props.college_id}`) 
            .then(res => res.data)
            .catch(error => {
                console.log(error)
                if (error.response.status !== 409) throw error
            })
    )

    const csrf = () => customAxios.get('/sanctum/csrf-cookie')

    const saveUser = async ({ setErrors, ...props }) => {
        await csrf()

        setErrors([])

        customAxios
            .post('/api/users/store', props)
            .then(() => mutate())
            .catch(error => {
                console.log(error)
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const updateUser = async ({ setErrors, ...props }) => {
        await csrf()

        setErrors([])

        customAxios
            .post('/api/users/update', props)
            .then(() => mutate())
            .catch(error => {
                console.log(error)
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const generatePassword = async () => {
        let pass = '';
        let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
            'abcdefghijklmnopqrstuvwxyz0123456789@#$';

        for (let i = 1; i <= 8; i++) {
            let char = Math.floor(Math.random()
                * str.length + 1);

            pass += str.charAt(char)
        }

        return pass;
    }

    // useEffect(() => {
        // console.log(user)
    // }, [users, user, error, students])

    return {
        users,
        user,
        students,
        error,
        generatePassword,
        saveUser,
        updateUser
    }
}
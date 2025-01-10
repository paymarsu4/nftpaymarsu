import useSWR from 'swr'
import customAxios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export const usePaymentCategories = ({ middleware } = {}) => {
    const router = useRouter()
    const params = useParams()

    const { data: paymentcategories, error, mutate } = useSWR('/api/paymentcategories', () =>
        customAxios.get('/api/paymentcategories') 
            .then(res => res.data)
            .catch(error => {
                console.log(error)
                if (error.response.status !== 409) throw error
            })
    )

    const csrf = () => customAxios.get('/sanctum/csrf-cookie')

    const savePaymentCategory = async ({ setErrors, ...props }) => {
        await csrf()

        setErrors([])

        customAxios
            .post('/api/paymentcategories/store', props)
            .then(() => mutate())
            .catch(error => {
                console.log(error)
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    const updatePaymentCategory = async ({ setErrors, ...props }) => {
        await csrf()

        setErrors([])

        customAxios
            .post('/api/paymentcategories/update', props)
            .then(() => mutate())
            .catch(error => {
                console.log(error)
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    useEffect(() => {
        console.log(paymentcategories)
    }, [paymentcategories, error])

    return {
        error,
        paymentcategories,
        // paymentcategory,
        savePaymentCategory,
        updatePaymentCategory
    }
};
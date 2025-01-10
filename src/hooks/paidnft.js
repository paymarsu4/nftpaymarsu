import useSWR from 'swr'
import customAxios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export const usePaidNfts = ({ middleware } = {}) => {
    const router = useRouter()
    const params = useParams()

    const { data: paidnfts, error, mutate } = useSWR('/api/paidnfts', () =>
        customAxios.get('/api/paidnfts') 
            .then(res => res.data)
            .catch(error => {
                console.log(error)
                if (error.response.status !== 409) throw error
            })
    )

    const csrf = () => customAxios.get('/sanctum/csrf-cookie')

    const savePaidNFT = async ({ setErrors, ...props }) => {
        await csrf()

        setErrors([])

        customAxios
            .post('/api/paidnfts/store', props)
            .then(() => mutate())
            .catch(error => {
                console.log(error)
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    // const updatePaymentCategory = async ({ setErrors, ...props }) => {
    //     await csrf()

    //     setErrors([])

    //     customAxios
    //         .post('/api/paymentcategories/update', props)
    //         .then(() => mutate())
    //         .catch(error => {
    //             console.log(error)
    //             if (error.response.status !== 422) throw error

    //             setErrors(error.response.data.errors)
    //         })
    // }

    useEffect(() => {
        // console.log(paidnfts)
    }, [paidnfts, error])

    return {
        error,
        paidnfts,
        // paymentcategory,
        savePaidNFT
    }
};
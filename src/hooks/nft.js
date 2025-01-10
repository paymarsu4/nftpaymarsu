import useSWR from 'swr'
import customAxios from '@/lib/axios'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export const useNfts = ({ middleware } = {}) => {
    const router = useRouter()
    const params = useParams()

    const { data: nfts, error, mutate } = useSWR('/api/nfts', () =>
        customAxios.get('/api/nfts') 
            .then(res => res.data)
            .catch(error => {
                console.log(error)
                if (error.response.status !== 409) throw error
            })
    )

    const csrf = () => customAxios.get('/sanctum/csrf-cookie')

    const saveNft = async ({ setErrors, ...props }) => {
        await csrf()

        setErrors([])

        customAxios
            .post('/api/nfts/store', props)
            .then(() => mutate())
            .catch(error => {
                console.log(error)
                if (error.response.status !== 422) throw error

                setErrors(error.response.data.errors)
            })
    }

    useEffect(() => {
    }, [nfts, error])

    return {
        error,
        nfts,
        saveNft
    }
};
import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
// import { useParams, useRouter } from 'next/navigation'

export const useColleges = () => {
    // const router = useRouter()
    // const params = useParams()

    const { data: colleges, error } = useSWR('/api/getcolleges', () =>
        axios.get('/api/getcolleges')
            .then(res => res.data)
            .catch(error => {
                // console.log(error)
                if (error.response.status !== 409) throw error
            }),
    )

    useEffect(() => {
        // console.log(colleges, "abs")
    }, [colleges, error])

    return {
        colleges,
        error
    }
}
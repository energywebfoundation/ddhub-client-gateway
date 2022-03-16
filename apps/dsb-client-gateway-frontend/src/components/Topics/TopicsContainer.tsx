import { Topic as TopicType } from '../../utils'
import Topic from './Topics'
import swal from '@sweetalert/with-react'
import { useState } from 'react'
import axios from 'axios'

type TopicContainerProps = {
    applicationNameSpace: string | string[] | undefined
    topics: TopicType[] | undefined
    auth?: string
    did?: string

}

export const TopicContainer = ({ applicationNameSpace, auth, topics, did }: TopicContainerProps) => {
    const [isLoading, setIsLoading] = useState(false)

    const handlePostTopic = async (body: TopicType) => {
        setIsLoading(true)

        try {
            const res = await axios.post(
                `/v1/dsb/topics`,
                body,
                {
                    headers: {
                        Authorization: auth ? `Bearer ${auth}` : undefined,
                        'content-type': 'application/json'
                    }
                }
            )
            console.log(res.data)

            swal(`Success: `, `Topic Created Successfully`, 'success')
        } catch (err) {
            if (axios.isAxiosError(err)) {
                swal('Error', err.response?.data?.err?.reason, 'error')
            } else {
                swal('Error', `Could not set identity: ${err}`, 'error')
            }
            setIsLoading(false)
        }
    }


    const handleUpdateTopic = async (body: TopicType) => {
        setIsLoading(true)

        try {
            const res = await axios.patch(
                `/v1/dsb/topics`,
                body,
                {
                    headers: {
                        Authorization: auth ? `Bearer ${auth}` : undefined,
                        'content-type': 'application/json'
                    }
                }
            )
            console.log(res.data)

            swal(`Success: `, `Topic Created Successfully`, 'success')
        } catch (err) {
            if (axios.isAxiosError(err)) {
                swal('Error', err.response?.data?.err?.reason, 'error')
            } else {
                swal('Error', `Could not set identity: ${err}`, 'error')
            }
            setIsLoading(false)
        }
    }

    return <Topic
        applicationName={applicationNameSpace}
        topics={topics} myDID={did}
        handlePostTopic={handlePostTopic}
        handleUpdateTopic={handleUpdateTopic} />
}

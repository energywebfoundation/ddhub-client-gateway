import dynamic from 'next/dynamic'
import '@asyncapi/react-component/styles/default.min.css'

const AsyncApiComponent = dynamic(
    () => import('@asyncapi/react-component/browser'),
    { ssr: false }
)

export default function AsyncApiDocs() {
    return (
        // @ts-ignore
        <AsyncApiComponent schema={{ url: '/api/v1/docs/ws.yaml' }} />
    )
}

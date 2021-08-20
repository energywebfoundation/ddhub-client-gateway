import fs from 'fs/promises'
import { join } from 'path'
import dynamic from 'next/dynamic'
import '@asyncapi/react-component/styles/default.min.css'
import { GetStaticProps, InferGetStaticPropsType } from 'next'

const AsyncApiComponent = dynamic(
    () => import('@asyncapi/react-component/browser'),
    { ssr: false }
)

export const getStaticProps: GetStaticProps = async (context) => {
    const path = join(process.cwd(), './public/ws.yaml')
    const schema = await fs.readFile(path, 'utf-8')
    return {
        props: {
            schema,
        },
    };
};

export default function AsyncApiDocs({ schema }: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        // @ts-ignore
        <AsyncApiComponent schema={schema} />
    )
}

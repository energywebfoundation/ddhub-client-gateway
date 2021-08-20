// import fs from 'fs/promises'
// import { join } from 'path'
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

import spec from '../../../public/rest.json'

export const getStaticProps: GetStaticProps = async (context) => {
    // const path = join(process.cwd(), './public/rest.yaml')
    // const spec = await fs.readFile(path, 'utf-8')
    // console.log('spec', spec)
    return {
        props: {
            spec,
        },
    };
};

export default function RestDocs({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <div style={{ backgroundColor: '#fff', padding: '2rem 0' }}>
            <SwaggerUI spec={spec}/>
        </div>
    );
};;

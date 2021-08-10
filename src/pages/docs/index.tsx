import { GetStaticProps, InferGetStaticPropsType } from 'next';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

import spec from '../../../public/spec.json'

export const getStaticProps: GetStaticProps = async (context) => {
    return {
        props: {
            spec,
        },
    };
};

const ApiDoc = ({ spec }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return (
        <div style={{ backgroundColor: '#fff', padding: '2rem 0' }}>
            <SwaggerUI spec={spec} />
        </div>
    );
};

export default ApiDoc;

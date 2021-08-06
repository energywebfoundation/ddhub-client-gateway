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
    return <SwaggerUI spec={spec} />;
};

export default ApiDoc;

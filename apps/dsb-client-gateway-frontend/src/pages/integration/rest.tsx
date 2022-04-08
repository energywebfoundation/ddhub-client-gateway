import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function RestDocs() {
  return (
    <div style={{ backgroundColor: '#fff', padding: '2rem 0' }}>
      <SwaggerUI url="/api/v1/docs/rest.yaml" />
    </div>
  );
}

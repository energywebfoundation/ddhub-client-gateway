import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

export default function RestDocs() {
    return (
        <div style={{ backgroundColor: '#fff', padding: '2rem 0' }}>
            <SwaggerUI url="/api/v1/docs/rest.yaml"/>
        </div>
    )
};;

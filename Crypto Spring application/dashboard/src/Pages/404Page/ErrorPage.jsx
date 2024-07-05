import React from 'react'

function ErrorPage({history}) {
    return (
        <div>
            404 error
            <p>Redirecting to  
                <span style={{color:'dodgerblue',cursor:'pointer'}} onClick={() => history.push('/')}>
                    login Page
                </span>
                <span style={{color:'dodgerblue',cursor:'pointer'}} onClick={() => history.push('/')}>
                    <p> Or register here</p>
                </span>
            </p>
        </div>
    )
}

export default ErrorPage

import React, { useEffect } from 'react';

export const handleTokenExpiration = (error,navigate) => {
    if (error.response && error.response.status === 401) {
                localStorage.clear();
                navigate('/');
        }
        console.log("This is the error response " + error.response.status)
}

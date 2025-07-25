/*eslint-disable react/prop-types */
/*eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
function BackButton () {
    const navigate = useNavigate();
    return (
        <Button type="back" onClick={(e) =>{
            e.preventDefault();
            navigate(-1)}}>
            &larr; Back
        </Button>
    );
}

export default BackButton;

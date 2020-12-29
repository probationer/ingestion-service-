import React from 'react'

function UploadButton({ onFormSubmit, onChange }) {

    return (
        <div>
            <form onSubmit={onFormSubmit}>
                <input type="file" onChange={onChange} />
                <button type="submit">Upload</button>
            </form>
        </div>
    )
}

export default UploadButton;
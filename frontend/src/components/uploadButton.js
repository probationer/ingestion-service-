import React from 'react'

class UploadButton extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <form onSubmit={this.props.onFormSubmit}>
                <h1>Ingestion Service</h1>
                <input type="file" onChange={this.props.onChange} />
                <button type="submit">Upload</button>
            </form>
        )
    }
}

export default UploadButton;
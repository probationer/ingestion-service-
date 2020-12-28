
import React from 'react';
import { put } from 'axios';

import './App.css';
import UploadButtons from './components/uploadButton';
import JobTable from './components/table';

import { getFromUrl, postCall } from './queryAsync';

import {
  BASE_URL,
  GET_PRESIGNED_URL,
  INGESTION
} from './constant';

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      rows: [],
      file: null
    }
    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  insertJob(s3Key, owner = 'default user') {
    const body = {
      s3Key, owner
    }
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*"
    }
    return postCall(BASE_URL + INGESTION, headers, body);
  }

  onFormSubmit(e) {
    e.preventDefault()
    if (this.state.file) {
      this.fileUpload(this.state.file)
        .then((response) => {
          console.log(response);
          return this.getIngestionJobs();
        })
        .then(() => {
          // this.startPolling()
          this.setState({ file: null });
        }).catch(err => {
          console.log(err);
        })
    }
  }

  onChange(e) {
    this.setState({ file: e.target.files[0] })
  }

  getStatus(serial, code) {
    const PATH = `${INGESTION}/${code}`;
    return getFromUrl(BASE_URL + PATH, null, null)
      .then(
        data => {
          const rows = [...this.state.rows];
          rows[serial - 1] = this.createData(
            serial, data.ingestion_id,
            data.s3_key, data.status
          );
          this.setState({ rows });
          return data.status;
        }
      )
      .catch(er => {
        console.log('error while fetch status', er);
      })
  }

  performUploadProcess = async (e) => {
    e.preventDefault()
    if (this.state.file) {
      try {
        const { url, key } = await getFromUrl(BASE_URL + GET_PRESIGNED_URL, null, null);
        await put(url, this.state.file);
        const { ingestionJobId } = await this.insertJob(key);
        await this.getIngestionJobs();
        this.startPolling(1, ingestionJobId);
        this.setState({ file: null });
      } catch (er) {
        console.log("Error while completing process", er)
      }
    }
  }

  startPolling(serial, code) {
    let counter = 1;
    this.interval = setInterval(
      async () => {
        if (counter > 10) {
          clearInterval(this.interval)
        } else {
          const status = await this.getStatus(serial, code);
          if (status === 'completed') {
            clearInterval(this.interval);
          }
          counter++;
        }
      },
      2000
    );
  }


  statusButton(serial, code) {
    return (
      <div>
        <button onClick={() => this.getStatus(serial, code)}>Fetch Status</button>
      </div>
    );
  }

  createData(serial, code, s3Key, status) {
    let button = this.statusButton(serial, code)
    if (status === 'completed') {
      button = null
    }
    return { serial, code, s3Key, status, button };
  }

  getIngestionJobs() {
    return getFromUrl(BASE_URL + INGESTION, null, null)
      .then(rows => {
        this.setState({
          rows: rows.map((row, index) => {
            return this.createData(
              (index + 1), row.ingestion_id,
              row.s3_key, row.status
            )
          })
        })
      }).catch(err => {
        console.log()
      })
  }

  componentDidMount() {
    this.getIngestionJobs()
  }

  render() {
    return (
      <div className="App">
        <UploadButtons onChange={this.onChange} onFormSubmit={this.performUploadProcess} />
        <div style={{ height: 50 }}></div>
        <JobTable rows={this.state.rows} />
      </div>
    );
  }
}

export default App;

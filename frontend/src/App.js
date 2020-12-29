
import React from 'react';
import moment from 'moment';

import UploadButtons from './components/UploadButton';
import SortTable from './components/SortTable';
import ViewUidModal from './components/ViewUidModal';
import Loader from './components/Loader';
import LinerLoader from './components/LinerLoader';

import './App.css';

import { getCall, postCall, putCall } from './queryAsync';

import {
  BASE_URL,
  DEVICES_BY_INGESTION_ID,
  GET_PRESIGNED_URL,
  INGESTION,
  JOB_STATUS
} from './constant';
const LOADER_TYPE = {
  UPLOAD_LOADER: 'uploadLoader',
  TABLE_LOADER: 'tableLoader'
}
class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      rows: [],
      file: null,
      isModalOpen: false,
      body: {},
      currentView: [],
      uploadLoader: false,
      tableLoader: true
    }
    this.onChange = this.onChange.bind(this)
  }

  /**
   * Perform upload process of file
   * 1. get presigned url
   * 2. upload file in S3 using signed url 
   * 3. insert job key by its id
   * 4. start polling process for new job
   */
  performUploadProcess = async (e) => {
    e.preventDefault()
    if (this.state.file) {
      try {
        this.handlerLoader(LOADER_TYPE.UPLOAD_LOADER, true);
        const { url, key } = await this.getS3PresignedUrl();
        await this.uploadFileInS3(url, this.state.file);
        const { ingestionJobId } = await this.insertJob(key);
        await this.getIngestionJobs();
        this.startPolling(1, ingestionJobId);
        this.setState({ file: null });
        this.handlerLoader(LOADER_TYPE.UPLOAD_LOADER, false);
      } catch (er) {
        console.log("Error while completing process", er)
      }
    }
  }

  /** Step1: Get presignedUrl for s3 upload file */
  async getS3PresignedUrl() {
    return getCall(BASE_URL + GET_PRESIGNED_URL, null, null)
  }

  /** Step2: Upload file in s3 using signed url */
  async uploadFileInS3(url, file) {
    putCall(url, file)
  }

  /** Step3: Insert job in backend using   */
  async insertJob(s3Key, owner = 'default user') {
    const body = { s3Key, owner }
    return postCall(BASE_URL + INGESTION, null, body);
  }

  /** Step 4: Get ingestion jobs from api */
  async getIngestionJobs() {
    this.handlerLoader(LOADER_TYPE.TABLE_LOADER, true);
    const rows = await getCall(BASE_URL + INGESTION, null, null)
    this.setState({
      rows: rows.map((row, index) => {
        const { ingestion_id, s3_key, status, created_at } = row;
        return this.createData(
          (index + 1), ingestion_id,
          s3_key, status, created_at
        );
      })
    })
    this.handlerLoader(LOADER_TYPE.TABLE_LOADER, false);
  }

  /**Step 5: Start polling of new status */
  startPolling(serial, code) {
    let counter = 1;
    this.interval = setInterval(
      async () => {
        if (counter > 3) {
          clearInterval(this.interval)
        } else {
          const status = await this.getIngestionJobDetailById(serial, code);
          if (status === JOB_STATUS.COMPLETED) {
            clearInterval(this.interval);
          }
          counter++;
        }
      },
      3000
    );
  }

  /** change state of loader */
  handlerLoader(type, isActive) {
    switch (type) {
      case LOADER_TYPE.UPLOAD_LOADER:
        this.setState({ uploadLoader: isActive });
        break;
      case LOADER_TYPE.TABLE_LOADER:
        this.setState({ tableLoader: isActive });
        break;
      default:
        console.log('Wrong loader');
    }
  }

  /** Get information of job by its ingestion id aka code */
  async getIngestionJobDetailById(serial, code) {

    const PATH = `${INGESTION}/${code}`;
    this.handlerLoader(LOADER_TYPE.TABLE_LOADER, true);
    const response = await getCall(BASE_URL + PATH, null, null);
    const rows = [...this.state.rows];
    const { ingestion_id, s3_key, status, created_at } = response;
    rows[serial - 1] = this.createData(serial, ingestion_id, s3_key, status, created_at);
    this.setState({ rows });
    this.handlerLoader(LOADER_TYPE.TABLE_LOADER, false);
    return status;

  }

  /** handler on change condition in upload button */
  onChange(e) {
    this.setState({ file: e.target.files[0] })
  }

  /** get button layout according to job status */
  statusButton(serial, code, jobStatus) {
    let buttonType;
    switch (jobStatus) {
      case JOB_STATUS.PENDING:
        buttonType = (<button onClick={() => this.getIngestionJobDetailById(serial, code)}>Fetch Status</button>);
        break;
      case JOB_STATUS.COMPLETED:
        buttonType = (<button onClick={() => this.viewUids(code)}>View Uid</button>);
        break;
      default:
        buttonType = null;
    }
    return buttonType;

  }

  /** Create and format data  */
  createData(serial, code, s3Key, status, date) {
    let button = this.statusButton(serial, code, JOB_STATUS.PENDING);
    if (status === JOB_STATUS.COMPLETED) {
      button = this.statusButton(serial, code, JOB_STATUS.COMPLETED);
    }
    date = moment(date).format('YYYY-MM-DD HH:MM:SS');
    return { serial, code, s3Key, status, date, button };
  }

  componentDidMount() {
    this.getIngestionJobs()
  }

  /** Get devide ids and platform of given id */
  async getDeviceIdsByIngestionId(id) {
    const PATH = `${DEVICES_BY_INGESTION_ID.replace('{id}', id)}`
    const resp = await getCall(BASE_URL + PATH, null, null)
    return resp;
  }

  /** View uids platform table of given ingestion code */
  async viewUids(code = null) {
    if (code) {
      if (!this.state.body[code]) {
        const response = await this.getDeviceIdsByIngestionId(code);
        const body = JSON.parse(JSON.stringify(this.state.body));
        body[code] = response;
        this.setState({ body })
      }
      this.setState({ currentView: this.state.body[code] });
    }
    this.toggleModal();
  }

  /** toggle modal between show/hide */
  toggleModal = () => {
    const isModalOpen = !this.state.isModalOpen;
    this.setState({ isModalOpen })
  }

  render() {
    return (
      <div className="App">
        <h1>Ingestion Service</h1>
        <div className="header">
          <UploadButtons onChange={this.onChange} onFormSubmit={this.performUploadProcess} />
          <div></div>
          {this.state.uploadLoader ? (<Loader size={20} />) : ''}
        </div>
        <ViewUidModal body={this.state.isModalOpen ? this.state.currentView : []} open={this.state.isModalOpen} handleClose={this.toggleModal} />
        <div style={{ height: 30, alignItems: "center" }}> </div>
        <div className="table">
          <div className="linerLoader">
            {this.state.tableLoader ? (<LinerLoader />) : (<div style={{ height: 50 }}></div>)}
          </div>
          <SortTable rows={this.state.rows} />
        </div>
      </div>
    );
  }
}

export default App;

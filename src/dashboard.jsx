import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import DatePicker from "react-datepicker";

//create a react component with name MessageDashBoard
export default class MessageDashBoard extends Component {
  //constructor
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      masterMessages: [],
      interfaceOptions: [],
      selectedInterface: "",
      messageStatus: "",
      acknowledgementStatus: "",
      startDate: "",
      endDate: "",
      message_ctrl_id: "",
      mr_no: "",
      offset: 0,
      perPage: 5,
      currentPage: 0,
      loading: false,
    };
    this.handlePageClick = this.handlePageClick.bind(this);
  }
  //componentDidMount
  componentDidMount() {
    this.getMessages();
  }
  //getMessages
  getMessages() {
    this.setState({ loading: true });
    axios
      .get("https://my-json-server.typicode.com/himanshuranjan30/demo/db")
      .then((response) => {
        console.log(response.data.data);
        var messagesData = response.data.data;
        var slicedData = messagesData.slice(
          this.state.offset,
          this.state.offset + this.state.perPage
        );
        this.setState({
          messages: slicedData,
          masterMessages: slicedData,
          pageCount: Math.ceil(response.data.data.length / this.state.perPage),
          loading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState(
      {
        currentPage: selectedPage,
        offset: offset,
      },
      () => {
        this.getMessages();
      }
    );
  };

  handleInterfaceChange = (e) => {
    this.setState({ selectedInterface: e.target.value });
  };

  handleMessageStatusChange = (e) => {
    this.setState({ messageStatus: e.target.value });
  };

  handleAcknowledgmentStatusChange = (e) => {
    this.setState({ acknowledgementStatus: e.target.value });
  };

  handleFilterApply = () => {
    //filter messages if interface
    this.setState({
      messages: this.state.messages.filter(
        (message) =>
          //check if selected interface is not empty
          (this.state.selectedInterface !== "" &&
            //check if selected interface is same as interface in message
            message.interface === this.state.selectedInterface) ||
          //check if message status is not empty
          (this.state.messageStatus !== "" &&
            message.message_status === this.state.messageStatus) ||
          //check if acknowledgement status is not empty
          (this.state.acknowledgementStatus !== "" &&
            message.acknowledgement_status ===
              this.state.acknowledgementStatus) ||
          //check if start date is not empty
          (this.state.startDate !== "" &&
            message.created_at >= this.state.startDate) ||
          //check if end date is not empty
          (this.state.endDate !== "" &&
            message.created_at <= this.state.endDate)
          //check if message_ctrl_id is not empty
          || (this.state.message_ctrl_id !== "" &&
            message.message_ctrl_id === this.state.message_ctrl_id)
          //check if mr_no is not empty
          || (this.state.mr_no !== "" &&
            message.mr_no === this.state.mr_no)
      

      ),
    });
  };

  handleFilterClear = () => {
    //reassign messages to master messages
    this.setState({
      messages: this.state.masterMessages,
      selectedInterface: "",
      messageStatus: "",
      acknowledgementStatus: "",
    });
  };

  //handle start date change
  handleStartDateChange = (startDate) => {
    this.setState({ startDate: startDate });
  };

  //handle end date change
  handleEndDateChange = (endDate) => {
    this.setState({ endDate: endDate });
  };

  //handle message ctrl id change
  handleMessageCtrlIdChange = (e) => {
    this.setState({ message_ctrl_id: e.target.value });
  };

  //handle mr no change
  handleMrNoChange = (e) => {
    this.setState({ mr_no: e.target.value });
  };

  //render

  render() {
    //show response data in a table
    return (
      <div className="center">
        <div className="row">
          <div className="col">
            Interface Name
            <select onChange={this.handleInterfaceChange}>
              <option value="" selected disabled hidden>
                Select
              </option>
              <option value="Orange">Orange</option>
              <option value="Radish">Radish</option>
              <option value="Cherry">Cherry</option>
            </select>
          </div>

          <div className="col">
            Messsage Status
            <select onChange={this.handleMessageStatusChange}>
              <option value="" selected disabled hidden>
                Select
              </option>
              <option value="active">Active</option>
              <option value="inactive">InActive</option>
            </select>
          </div>

          <div className="col">
            Acknowledgement Status
            <select onChange={this.handleAcknowledgmentStatusChange}>
              <option value="none" selected disabled hidden>
                Select
              </option>
              <option value="Orange">Orange</option>
              <option value="Radish">Radish</option>
              <option value="Cherry">Cherry</option>
            </select>
          </div>

          <div className="col">
            Start Date
            <DatePicker
              selected={this.state.startDate}
              onChange={(date) => this.handleStartDateChange(date)}
            />
          </div>

          <div className="col">
            End Date
            <DatePicker
              selected={this.state.endDate}
              onChange={(date) => this.handleEndDateChange(date)}
            />
          </div>

          <div className="col">
            MessageCtrlId
            <input
              type="text"
              className="form-control"
              placeholder="Message Ctrl Id"
              value={this.state.message_ctrl_id}
              onChange={this.handleMessageCtrlIdChange}
            />
          </div>
          <div className="col">
            MrNo.
            <input
              type="text"
              className="form-control"
              placeholder="Mr No"
              value={this.state.mr_no}
              onChange={this.handleMrNoChange}
            />
          </div>
        </div>
        <div className="buttonContainer">
          <Button
            className="ui primary button"
            onClick={this.handleFilterApply}
          >
            Filter
          </Button>
          <Button onClick={this.handleFilterClear}>Clear</Button>
        </div>
        <Table celled>
          <Table.Header fullWidth>
            <Table.Row>
              <Table.HeaderCell>message_ctrl_id</Table.HeaderCell>
              <Table.HeaderCell>message</Table.HeaderCell>
              <Table.HeaderCell>message status</Table.HeaderCell>
              <Table.HeaderCell>acknowledgement</Table.HeaderCell>
              <Table.HeaderCell>acknowledgement status</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.messages.map((message) => {
              return (
                <Table.Row key={message.message_ctrl_id}>
                  <Table.Cell>{message.message_ctrl_id}</Table.Cell>
                  <Table.Cell data-title={message.message}>
                    {message.message}
                  </Table.Cell>
                  <Table.Cell>{message.message_status}</Table.Cell>
                  <Table.Cell>{message.acknowledgement}</Table.Cell>
                  <Table.Cell>{message.acknowledgement_status}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.Cell>
                <ReactPaginate
                  previousLabel={"prev"}
                  nextLabel={"next"}
                  breakLabel={"..."}
                  breakClassName={"break-me"}
                  pageCount={this.state.pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={this.handlePageClick}
                  containerClassName={"pagination"}
                  subContainerClassName={"pages pagination"}
                  activeClassName={"active"}
                />
              </Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    );
  }
}

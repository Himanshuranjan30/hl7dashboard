import React, { Component } from "react";
import { Table} from "semantic-ui-react";
import axios from "axios";
import ReactPaginate from "react-paginate";

//create a react component with name MessageDashBoard
export default class MessageDashBoard extends Component {
  //constructor
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
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

  //render

  render() {
    //show response data in a table
    return (
      <div>
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
                  <Table.Cell>{message.message}</Table.Cell>
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

import React from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { EditAuthorForm } from "./EditAuthorForm";
import { AddAuthorForm } from "./AddAuthorForm";

let url = "http://localhost:3000/";

export default class AuthorList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      authors: [],
      books: [],
      author_books: [],
      data: [],
      sort: {
        column: null,
        direction: "desc"
      },
      showModal: null
    };
    //this.RemoveBooksFromArray = RemoveBooksFromArray.bind(this);
    this.AddToArray = AddToArray.bind(this);
    this.EditInArray = EditInArray.bind(this);
    this.initialState = this.state;

    this.sort_setting = "Sort by: Id (asc)";
  }

  async componentDidMount() {
    await axios.get(url + "author").then(res => {
      this.setState({ authors: res.data });
    });
    await axios.get(url + "book").then(res => {
      this.setState({ books: res.data });
    });
    await axios.get(url + "author_book").then(res => {
      this.setState({ author_books: res.data });
    });
  }

  onRemoveItem = async id => {
    for (let i = 0; i < this.state.data.length; i++) {
      for (let j = 0; j < this.state.data[i].author_books.length; j++) {
        if (this.state.data[i].author_books[j].authorId === id) {
          await axios.delete(
            url + "author_book/" + this.state.data[i].author_books[j].id
          );
        }
      }
    }
    this.state.data.splice(
      this.state.data.find(x => x.id === id),
      1
    );
    await axios.delete(url + "author/" + id);
    this.setState(state => {
      const authors = state.authors.filter(item => item.id !== id);
      return {
        authors
      };
    });
  };

  onSort = column => e => {
    const direction = this.state.sort.column
      ? this.state.sort.direction === "asc"
        ? "desc"
        : "asc"
      : "desc";
    const sortedData = this.state.data.sort((a, b) => {
      this.sort_setting = "Sort by: ";
      switch (column) {
        case "firstName":
          this.sort_setting += "First name";
          break;
        case "lastName":
          this.sort_setting += "Last name";
          break;
        case "dateOfBirth":
          this.sort_setting += "Date of birth";
          break;
        case "id":
          this.sort_setting += "Id";
          break;
        default:
          break;
      }
      if (
        column === "firstName" ||
        column === "lastName" ||
        column === "dateOfBirth" ||
        column === "id"
      ) {
        var nameA;
        var nameB;
        if (column === "id") {
          nameA = a.id; // ignore upper and lowercase
          nameB = b.id; // ignore upper and lowercase
        }
        if (column === "firstName") {
          nameA = a.firstName.toUpperCase(); // ignore upper and lowercase
          nameB = b.firstName.toUpperCase(); // ignore upper and lowercase
        }
        if (column === "lastName") {
          nameA = a.lastName.toUpperCase(); // ignore upper and lowercase
          nameB = b.lastName.toUpperCase(); // ignore upper and lowercase
        }
        if (column === "dateOfBirth") {
          nameA = a.dateOfBirth.toUpperCase(); // ignore upper and lowercase
          nameB = b.dateOfBirth.toUpperCase(); // ignore upper and lowercase
        }
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      }
      return 0;
    });

    if (direction === "desc") {
      sortedData.reverse();
      this.sort_setting += " (desc)";
    } else {
      this.sort_setting += " (asc)";
    }

    this.setState({
      authors: sortedData,
      sort: {
        column,
        direction
      }
    });
  };

  setShowModal(id, event) {
    let st = null;
    if (id => -1) {
      st = "modal" + id;
    }
    this.setState({ showModal: st });
  }

  handleChange = event => {
    this.setState({ search: event.target.value, data: [] });
  };

  prepareData() {
    const { search, authors, books, author_books, data } = this.state;
    const lowercasedSearch = search.toLowerCase();
    const searchedAuthors = authors.filter(item => {
      return Object.keys(item).some(key =>
        item[key]
          .toString()
          .toLowerCase()
          .includes(lowercasedSearch)
      );
    });

    for (let i = 0; i < searchedAuthors.length; i++) {
      data[i] = {
        id: searchedAuthors[i].id,
        firstName: searchedAuthors[i].firstName,
        lastName: searchedAuthors[i].lastName,
        dateOfBirth: searchedAuthors[i].dateOfBirth,
        imageUrl: searchedAuthors[i].imageUrl,
        books: [],
        author_books: []
      };
    }

    for (let i = 0; i < data.length; i++) {
      const author_booksFiltered = author_books.filter(
        x => x.authorId === data[i].id
      );
      for (let k = 0; k < author_booksFiltered.length; k++) {
        var book = books.find(x => x.id === author_booksFiltered[k].bookId);
        data[i].books.push(book);
        data[i].author_books.push(author_booksFiltered[k]);
      }
    }
  }

  render() {
    this.prepareData();
    return (
      <>
        <div className="container" id="header">
          <div className="row justify-content-md-around">
            <div className="col-12 col-md-3 order-md-1">
              <Button
                id="add_author"
                variant="primary"
                onClick={() => this.setShowModal(-1)}
              >
                Add author
              </Button>
              <AddAuthorForm
                show={this.state.showModal === "modal" + -1}
                onHide={() => this.setShowModal(0)}
              />
            </div>
            <div className="col-12 col-md-3 order-md-2">
              <div id="sort">
                <Button
                  id="sort_button"
                  variant="primary"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {this.sort_setting}
                </Button>
                <div className="dropdown-menu">
                  <p id="id" onClick={this.onSort("id")}>
                    Id (default)
                  </p>
                  <p id="first_name" onClick={this.onSort("firstName")}>
                    First name
                  </p>
                  <p id="last_name" onClick={this.onSort("lastName")}>
                    Last name
                  </p>
                  <p id="date_of_birth" onClick={this.onSort("dateOfBirth")}>
                    Date of birth
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-3 order-md-3">
              <input
                id="searchbox"
                type="text"
                value={this.state.search}
                onChange={this.handleChange}
                placeholder="Filter"
                aria-label="Filter"
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="row justify-content-start" id="record_container">
          {this.state.data.map(author => (
            <div className="container col-12 col-lg-6" key={author.id}>
              <div className="record row">
                <div className="col-12 row">
                  <div className="record_id col-2">#{author.id}</div>
                  <div className="record_name col-auto">{author.firstName}</div>
                  <div className="record_surname col-auto">
                    {author.lastName}
                  </div>
                  <div className="record_name col-auto align-self-end">
                    {author.dateOfBirth}
                  </div>
                </div>
                <div className="image col-12 col-sm-auto">
                  <img src={author.imageUrl} alt="Author"></img>
                </div>
                <div className="col-12 col-sm">
                  {author.books.map(book => (
                    <p className="book_list mb-3" key={book.id}>
                      {book.title}
                    </p>
                  ))}
                </div>
                <div className="buttons col-12">
                  <Button
                    className="left"
                    variant="primary"
                    onClick={() => this.setShowModal(author.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="right"
                    value="primary"
                    onClick={() => this.onRemoveItem(author.id)}
                  >
                    Remove
                  </Button>
                  <EditAuthorForm
                    show={this.state.showModal === "modal" + author.id}
                    onHide={() => {
                      this.setShowModal(0);
                    }}
                    id={author.id}
                    firstname={author.firstName}
                    lastname={author.lastName}
                    dateOfBirth={author.dateOfBirth}
                    imageUrl={author.imageUrl}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
}

export function AddToArray(author) {
  this.setState(state => {
    const authors = state.authors.push(author);
    return {
      authors
    };
  });
}

export function EditInArray(author) {
  this.setState(this);
}

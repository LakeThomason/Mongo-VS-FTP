import React, { Component, Fragment } from "react";
import {
  Col,
  Jumbotron,
  FormGroup,
  Label,
  Input,
  FormText,
  Button
} from "reactstrap";
import axios from "axios";

class UploadFiles extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.uploads = this.uploads.bind(this);
  }

  componentDidMount() {}

  uploads(event) {
    console.log("uploading...");
    this.files = [];
    for (let i = 0; i < event.target.files.length; i++) {
      this.files.push(event.target.files[i]);
    }
    // app.post("/upload", upload.array("file", 100), (req, res) => {});
    let formData = new FormData();
    // Add each file to the formData object
    this.files.forEach(function(value, i) {
      formData.append("file" + i, value);
    });
    axios
      .post("/upload", formData)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log("FILE UPLOAD ERROR", error);
      });
  }

  render() {
    return (
      <Fragment>
        <Col>
          <Jumbotron>
            <h1 id="landingPage" className="display-6">
              POST File Uploads Center
            </h1>
            <FormGroup>
              <Label for="exampleFile">Image File</Label>
              <Input type="file" name="file" id="exampleFile" multiple={true} />
              <FormText color="muted">
                Please select the file you want to upload
              </FormText>
            </FormGroup>
            <Button
              key={"fileUpload"}
              color="primary"
              type="file"
              onClick={event => this.uploads(event)}
            >
              Upload Files to MongoDB
            </Button>
          </Jumbotron>
        </Col>
      </Fragment>
    );
  }
}

export default UploadFiles;

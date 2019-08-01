import React, { Component, Fragment } from "react";
import { Row, Col, Container, Label, Button } from "reactstrap";

// Test settings
const ftpBase =
  "https://lp.post.ca.gov/post/images/activities/posters/DVD_RE_APP/Body_Worn_Cameras/bigBoiImage%20-%20Copy%20(";
const mongoBase = "http://localhost:4000/image/bigBoiImage%20-%20Copy%20(";
const endUrl = ").jpg";
const _numImages = [...Array(100).keys()];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { timer: 0, numLoaded: 0, running: false, mongoImages: [] };
    this.ftpTest = this.ftpTest.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.endTimer = this.endTimer.bind(this);
  }

  ftpTest() {
    this.startTimer();
    return _numImages.map(index => {
      return (
        <img
          key={index}
          src={`${ftpBase}${index}${endUrl}`}
          style={{ height: "90px", width: "160px" }}
          onLoad={() =>
            this.setState({ numLoaded: this.state.numLoaded + 1 }, () => {
              if (this.state.numLoaded === _numImages.length) {
                this.endTimer();
              }
            })
          }
        />
      );
    });
  }

  mongoTest() {
    this.startTimer();
    return _numImages.map(index => {
      return (
        <img
          key={index}
          src={`${mongoBase}${index}${endUrl}`}
          style={{ height: "90px", width: "160px" }}
          onLoad={() =>
            this.setState({ numLoaded: this.state.numLoaded + 1 }, () => {
              if (this.state.numLoaded === _numImages.length) {
                this.endTimer();
              }
            })
          }
        />
      );
    });
  }

  startTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(this.tick.bind(this), 100);
  }

  tick() {
    this.setState({ timer: this.state.timer + 0.1 });
  }

  endTimer() {
    clearInterval(this.timer);
    this.setState({ running: false });
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <Label>Timer: {this.state.timer} </Label>
          </Col>
          <Col>
            <Button
              color="success"
              onClick={() =>
                this.setState({
                  test: "FTP",
                  running: true,
                  timer: 0,
                  numLoaded: 0
                })
              }
            >
              Run FTP test
            </Button>{" "}
            <Button
              color="danger"
              onClick={() =>
                this.setState({
                  test: "Mongo",
                  running: true,
                  timer: 0,
                  numLoaded: 0
                })
              }
            >
              Run Mongo Test
            </Button>
          </Col>
          <br />
        </Row>
        {this.state.running ? (
          <Row>
            {this.state.test === "FTP" ? this.ftpTest() : this.mongoTest()}
          </Row>
        ) : null}
      </Container>
    );
  }
}

export default App;

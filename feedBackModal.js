import React, { useRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import platform from 'platform';
import {
  CircularProgress,
  Grid,
  Button,
  Radio,
  FormControlLabel,
  RadioGroup,
  TextareaAutosize,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import html2canvas from "html2canvas";

const useStyles = makeStyles((theme) => ({
  textarea: {
    width: "100%",
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "60%",
    borderStyle: "ridge",
  },
  MuiDialog: {
    MuiBackdrop: {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
  },
  alignSpinner: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

const FeedBackModal = (props) => {
  const classes = useStyles();
  const { openModal, handleClose } = props;
  const [screenshotCanvasSource, setScreenshotCanvasSource] = useState(null);
  const [selectedRadio, setSelectedRadio] = useState('Defect');
  const [feedbackData, setFeedbackData] = useState(null); 
  const [textArea, setTextArea] = useState();
  const screenshotAp = useRef(null);
  let screenshotEle = "";

  console.log('platform', platform);
  useEffect(() => {
    console.log("222");
    initScreenshotCanvas();
  }, [openModal]);

  const cancelFeedback = (e) => {
    // e.preventDefault();
    clearScreenshot();
    handleClose();
    return false;
  };

  const clearScreenshot = () => {
    screenshotAp.current.innerHTML = "";
  };

  const appendScreenshot = () => {
    clearScreenshot();
    screenshotAp.current.appendChild(screenshotEle);
  };

  const getImgEle = (canvas) => {
    const img = canvas.toDataURL("image/png"),
      imageEle = document.createElement("img");
    imageEle.setAttribute("src", img);
    Object.assign(imageEle.style, {
      left: "0",
      margin: "0 auto",
      maxHeight: "100%",
      maxWidth: "100%",
    });
    return imageEle;
  };

  const setScreenshot = () => {
    let canvas = screenshotCanvasSource;
    console.log("canvas", canvas);
    setFeedbackData(canvas.toDataURL("image/png").match(/base64,(.+)$/)[1]);
    screenshotEle = getImgEle(canvas);
    //console.log('canvas', canvas);
    //console.log('screenshotEle', screenshotEle);
    appendScreenshot();
  };

  const initScreenshotCanvas = () => {
    if (openModal) {
      setTimeout(() => {
        const body = document.body;
        console.log("clientWidth", document.documentElement.clientWidth);
        console.log("clientWidth", document.documentElement.clientHeight);
        html2canvas(body, {
          logging: false,
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight,
          x: document.documentElement.scrollLeft,
          y: document.documentElement.scrollTop,
        }).then((bodyCanvas) => {
          setScreenshotCanvasSource(bodyCanvas);
        });
      }, 1000);
    }
    // } else {
    //     clearScreenshot();
    // }
  };

  useEffect(() => {
    if (screenshotCanvasSource) {
      setScreenshot();
    }
  }, [screenshotCanvasSource]);

  const onRadioChange = (e)=> {
    setSelectedRadio(e.target.value);
}

const onTextChange = (e)=> {
    setTextArea(e.target.value);
}

  console.log("screenshotCanvasSource1", screenshotCanvasSource);
  return (
    <div>
      <Dialog
        open={openModal}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        BackdropProps={{ style: { backgroundColor: "rgba(0, 0, 0, 0.2)" } }}
      >
        <DialogTitle id="form-dialog-title">Send feedBack</DialogTitle>
        <DialogContent>
          <DialogContentText>
            *Please click here for the existing feedback/defect
          </DialogContentText>
          <input type="hidden" name="data" value={feedbackData} />
          <input type="hidden" name="from" value={ localStorage.metaData && JSON.parse(localStorage.metaData).username ? JSON.parse(localStorage.metaData).username : 'mhussai4'} />
          <input type="hidden" name="browser_details" value={`${platform.name}(${platform.version})`} />
          <input type="hidden" name="os_details" value={`${platform.os.family}${platform.os.architecture}(${platform.os.version})`} />
          <TextareaAutosize
            aria-label="minimum height"
            rowsMin={5}
            className={classes.textarea}
            placeholder="Describe your issue or share your ideas"
            value={textArea}
            onChange={(e)=> onTextChange(e)}
          />
          <RadioGroup
            row
            aria-label="position"
            name="position"
            defaultValue="top"
          >
            <FormControlLabel
              control={<Radio color="primary" />}
              label="Defect"
              value="Defect"
              checked={ selectedRadio === 'Defect' }
              onChange={(e)=> onRadioChange(e)}
            />
            <FormControlLabel
              control={<Radio color="primary" />}
              label="Task"
              value="Task"
              checked={ selectedRadio === 'Task' }
              onChange={(e)=> onRadioChange(e)}
            />
          </RadioGroup>
          {screenshotCanvasSource ? (
            <Grid item ref={screenshotAp} className={classes.img} />
          ) : (
            <div className={classes.alignSpinner}><CircularProgress color="inherit" size="15px"/></div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FeedBackModal;

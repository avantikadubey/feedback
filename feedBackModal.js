import React, { useRef, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import platform from "platform";
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
  modal: {
    "& .MuiDialog-paperWidthSm": {
      maxWidth: "415px",
    },
  },
  textarea: {
    width: "100%",
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "58%",
    borderStyle: "ridge",
  },
  alignSpinner: {
    display: "flex",
    justifyContent: "center",
  },
  title: {
    backgroundColor: "#428bca",
  },
  content: {
    backgroundColor: "#F5F5F5",
  },
}));

const FeedBackModal = (props) => {
  const classes = useStyles();
  const { openModal, handleClose, submitFeedback } = props;
  const screenshotAp = useRef(null);
  let screenshotEle = "";
  const intialData = useMemo(() => ({
    screenshotCanvasSource: null,
    selectedRadio: "Defect",
    feedbackData: null,
    textArea: "",
    browser_details: platform.name + platform.version,
    os_details:
      platform.os.family + platform.os.architecture + platform.os.version,
    from:
      localStorage.metaData && JSON.parse(localStorage.metaData).username
        ? JSON.parse(localStorage.metaData).username
        : "mhussai4",
  }));
  const [formFields, setFormFields] = useState(intialData);

  useEffect(() => {
    initScreenshotCanvas();
  }, [openModal]);

  const cancelFeedback = (e) => {
    // e.preventDefault();
    setFormFields(intialData);
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
    let canvas = formFields.screenshotCanvasSource;
    setFormFields({
      ...formFields,
      feedbackData: canvas.toDataURL("image/png").match(/base64,(.+)$/)[1],
    });
    screenshotEle = getImgEle(canvas);
    appendScreenshot();
  };

  const initScreenshotCanvas = () => {
    if (openModal) {
      setTimeout(() => {
        const body = document.body;
        html2canvas(body, {
          logging: false,
          width: document.documentElement.clientWidth,
          height: document.documentElement.clientHeight,
          x: document.documentElement.scrollLeft,
          y: document.documentElement.scrollTop,
        }).then((bodyCanvas) => {
          setFormFields({ ...formFields, screenshotCanvasSource: bodyCanvas });
        });
      }, 1000);
    }
    // } else {
    //     clearScreenshot();
    // }
  };

  useEffect(() => {
    if (formFields.screenshotCanvasSource) {
      setScreenshot();
    }
  }, [formFields.screenshotCanvasSource]);

  const onRadioChange = (e) => {
    setFormFields({ ...formFields, selectedRadio: e.target.value });
  };

  const onTextChange = (e) => {
    setFormFields({ ...formFields, textArea: e.target.value });
  };

  return (
    <div>
      <Dialog
        className={classes.modal}
        open={openModal}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        BackdropProps={{ style: { backgroundColor: "rgba(0, 0, 0, 0.2)" } }}
      >
        <DialogTitle id="form-dialog-title" className={classes.title}>
          Send feedBack
        </DialogTitle>
        <DialogContent className={classes.content}>
          <DialogContentText>
            *Please click here for the existing feedback/defect
          </DialogContentText>
          <TextareaAutosize
            aria-label="minimum height"
            rowsMin={5}
            className={classes.textarea}
            placeholder="Describe your issue or share your ideas"
            value={formFields.textArea}
            onChange={(e) => onTextChange(e)}
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
              checked={formFields.selectedRadio === "Defect"}
              onChange={(e) => onRadioChange(e)}
            />
            <FormControlLabel
              control={<Radio color="primary" />}
              label="Task"
              value="Task"
              checked={formFields.selectedRadio === "Task"}
              onChange={(e) => onRadioChange(e)}
            />
          </RadioGroup>
          {formFields.screenshotCanvasSource ? (
            <Grid item ref={screenshotAp} className={classes.img} />
          ) : (
            <div className={classes.alignSpinner}>
              <CircularProgress color="inherit" size="15px" />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelFeedback} variant="contained" color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => submitFeedback(formFields)}
            variant="contained"
            color="primary"
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

FeedBackModal.propTypes = {
  handleClose: PropTypes.func,
  openModal: PropTypes.bool,
  submitFeedback: PropTypes.func,
};

export default FeedBackModal;

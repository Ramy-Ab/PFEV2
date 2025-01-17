import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { foodNutritionList } from "../actions/foodAction";
import { getTraineeInfo } from "../actions/userActions";
import { useDropzone } from "react-dropzone";
import SideBar from "../components/SideBar";
import Divider from "@material-ui/core/Divider";
import { Divider as antDivider } from "antd";
import "./FoodAiScreen.css";
import upload from "../images/upload-photo.png";
import {
  InputGroup,
  FormControl,
  Button as RButton,
  Spinner,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { MDBCol, MDBFormInline, MDBIcon } from "mdbreact";
import Paper from "@material-ui/core/Paper";
import SaveIcon from "@material-ui/icons/Save";
import Side from "../components/Side";
import "antd/dist/antd.css";
import "../index.css";
import { Progress } from "antd";
import { Input } from "antd";
import "antd/dist/antd.css";
import objectif from "../assets/objectif.svg";
import scale from "../assets/scale.svg";
import addFood from "../assets/adding.svg";
import edit from "../assets/edit.svg";
import diet from "../assets/diet.svg";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import WeightDialog from "../components/WeightDialog";
import NutritionsDialog from "../components/NutritionsDialog";
import FoodList from "../components/FoodList";

const Search = Input.Search;

function ObjectifScreen() {
  const [openWeight, setOpenWeight] = React.useState(false);
  const [openNutritions, setOpenNutritions] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [calories, setCalories] = useState("");
  const [protein_g, setProtein_g] = useState("");
  const [carbohydrates_total_g, setCarbohydrates_total_g] = useState("");
  const userDetails = useSelector((state) => state.userDetails);
  const { error: errorUser, loading: loadingUser, user } = userDetails;
  const [weight, setWeight] = useState("");
  const [weightGoal, setWeightGoal] = useState("");
  const [dailyNutrition, SetDailyNutrition] = useState([]);
  const [weightG, setWeightG] = useState();
  const [calorieTotal, setCalorieTotal] = useState(0);
  const [proteineTotal, setProteineTotal] = useState(0);
  const [carbTotal, setCarbTotal] = useState(0);

  console.log("user : ", dailyNutrition);
  // console.log("setCalorieTotal : ", calorieTotal);

  const traineeInfo = useSelector((state) => state.traineeInfo);
  const {
    loading: loadingInfo,
    success: successInfo,
    error: errorInfo,
    personelInfo,
  } = traineeInfo;

  // const [openWeight, setOpenWeight] = React.useState(openedWeight);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(getTraineeInfo(userInfo.id));
    console.log("dispatched");
  }, []);

  useEffect(() => {
    if (traineeInfo !== undefined) {
      try {
        console.log("personelInfo : ", personelInfo);
        setWeight(personelInfo["userProfile"].weight);
        setWeightGoal(personelInfo["userProfile"].weightGoal);
      } catch (error) {
        console.log(error);
      }
    }
  }, [successInfo]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const foodNutrition = useSelector((state) => state.foodNutrition);
  const { success, error, loading, nutritions = [] } = foodNutrition;

  useEffect(() => {
    let total_carb = 0;
    let total_prot = 0;
    let total_cal = 0;

    dailyNutrition.forEach((elm) => {
      total_carb += parseFloat(elm.carb);
      total_prot += parseFloat(elm.proteine);
      total_cal += parseFloat(elm.calorie);
    });

    console.log("personel Infos :", personelInfo);

    if (personelInfo && personelInfo.userProfile) {
      setCarbTotal(
        Math.floor((total_carb / personelInfo.userProfile.carbs) * 100)
      );
      setProteineTotal(
        Math.floor((total_prot / personelInfo.userProfile.proteines) * 100)
      );
      setCalorieTotal(
        Math.floor((total_cal / personelInfo.userProfile.calories) * 100)
      );
    }
  }, [dailyNutrition, personelInfo]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleWeight = () => {
    // setOpenWeight((prevOpenWeight) => !prevOpenWeight);
    setOpenWeight(true);
  };

  const handleNutritions = () => {
    setOpenNutritions(true);
  };

  const handleSave = () => {
    setOpen(false);
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    console.log("nutritions to send", nutritions[0]);
    const data = {
      calorie: (nutritions[0].calories * weightG) / 100,
      proteine: (nutritions[0].protein_g * weightG) / 100,
      carb: (nutritions[0].carbohydrates_total_g * weightG) / 100,
      foodName: result,
      foodWeight: weightG,
    };
    axios
      .post(`/api/users/addnutrition/${userInfo.id}/`, data, config)
      .then((res) => {
        console.log("sending data :      ", res.data);
        axios
          .get(`/api/users/getnutritions/${userInfo.id}/`)
          .then((res) => {
            SetDailyNutrition(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => console.log(err));
  };

  // food recognition
  const [result, setResult] = useState("");
  const [display, setDisplay] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [input, setInput] = useState("");
  const [send, setSend] = useState(false);

  useEffect(() => {
    if (result) {
      console.log("useEffect trigred");
      console.log("state", loading, success);
      // console.log('function',  foodNutritionList(result))
      if (result) {
        dispatch(foodNutritionList(result));
      }
    } else {
      dispatch(foodNutritionList("pizza"));
    }
  }, [result]);

  useEffect(() => {
    axios
      .get(`/api/users/getnutritions/${userInfo.id}/`)
      .then((res) => {
        SetDailyNutrition(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {}, [success]);

  useEffect(() => {
    if (!loading && success) {
      console.log("nutritions : ", nutritions[0]);
      console.log("sugar : ", nutritions[0].sugar_g);
    } else if (!(loading && success)) {
      console.log("error", error);
    }
  }, [success]);

  const blobToBase64 = (blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  };

  const onUploadButton = () => {
    if (Image[0]) {
      blobToBase64(Image[0]).then((res) => {
        sendData(res);
      });
    }
  };

  const sendData = (c) => {
    setSend(true);
    console.log("send_true : ", send);
    // sending data to machine learning model
    //test
    const headers = {
      accept: "application/json",
    };

    const fd = new FormData();
    fd.append("image", c);

    axios
      .post("/api/foodai/food/", fd, { headers: headers })
      .then((res) => {
        console.log("sending data :      ", res.data);

        getImageResult(res.data.id);
        setSend(false);
        console.log("send : ", send);
      })
      .catch((err) => console.log(err));

    //getting result from model

    const getImageResult = (id) => {
      axios
        .get(`/api/foodai/food/${id}`)
        .then((res) => {
          console.log("receiving data :      ", res.data);

          setResult(res.data.result);
        })
        .catch((err) => console.log(err));
    };
  };

  const imageHandler = (e) => {
    console.log(e.target.files[0]);
  };

  const onInputChange = (e) => {
    setInput(e.target.value);
  };

  const onButtonSubmit = () => {
    setImageUrl(input);
    console.log(imageUrl);
  };

  const uploadImage = async (e) => {
    console.log(e);
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const [Image, setImage] = useState([]);
  const { getRootProps, getInputProps, isDragAActive } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setImage(
        acceptedFiles.map((upFile) =>
          Object.assign(upFile, {
            preview: URL.createObjectURL(upFile),
          })
        )
      );
    },
  });

  const hideDropBox = () => {
    setDisplay(false);
    console.log("object");
  };

  //end

  return (
    <div className="traineDash" style={{ minHeight: "180vh" }}>
      <Row>
        <Col className="col-md-2">
          <Side />
        </Col>

        <Col className="col-md-10  p-5 center mt-5">
          <div class="fullWidth flex-left flex-column">
            <h3 className="h-black"> Current Goals </h3>
            {/* <Progress
            type="circle"
            percent={100}
            format={(percent) => `${percent} Days`}
          /> */}
            <p style={{ color: "#797c80", fontSize: "14px" }}>
              Here You can set your objectifs and track your progress based on
              your daily nutrition goal .
            </p>
          </div>
          <div className="goals fullContent layout__constrained">
            {/* setweight */}
            <div className="goalTile flex-left flex-column">
              <Row className="p-3 col-md-12">
                <Col className="col-md-2">
                  <img
                    src={scale}
                    alt="weight"
                    style={{ height: "40px", width: "40px" }}
                  />
                </Col>
                <Col className="col-md-8">
                  <p
                    style={{
                      color: "#303133",
                      fontSize: "18px",
                      fontWeight: "400",
                    }}
                  >
                    Weight goal
                  </p>
                </Col>
                <Col className="col-md-1 mr-0 ml-5">
                  <div className="mb-2 ">
                    <img
                      src={edit}
                      alt="edit"
                      style={{ cursor: "pointer" }}
                      onClick={handleWeight}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="col-md-12 px-5 progress-weight">
                <span style={{ display: "flex", justifyContent: "center" }}>
                  <Progress
                    percent={((weight * 100) / weightGoal).toFixed(2)}
                  />
                  <p style={{ color: "black", fontSize: "16px" }}>
                    {weightGoal}
                  </p>
                  {"  "}
                  <p style={{ color: "black", fontSize: "16px" }}> Kg</p>
                </span>
              </Row>
            </div>
            {/* finset weight */}

            <div className="goalTile flex-left flex-column">
              <Row className="p-3 col-md-12">
                <Col className="col-md-2">
                  <img
                    src={objectif}
                    alt="food"
                    style={{ height: "40px", width: "40px" }}
                  />
                </Col>
                <Col className="col-md-8">
                  <p
                    style={{
                      color: "#303133",
                      fontSize: "18px",
                      fontWeight: "400",
                    }}
                  >
                    Daily nutrition goal
                  </p>
                </Col>
                <Col className="col-md-1 mr-0 ml-5">
                  <div className="mb-2 ">
                    <img
                      src={edit}
                      alt="edit"
                      style={{ cursor: "pointer" }}
                      onClick={handleNutritions}
                    />
                  </div>
                </Col>
              </Row>
              <Row className="col-md-12 px-5">
                <span style={{ display: "flex", justifyContent: "center" }}>
                  <Progress percent={calorieTotal} />
                  <p style={{ color: "black", fontSize: "16px" }}>Calories</p>
                </span>
                <span style={{ display: "flex", justifyContent: "center" }}>
                  <Progress percent={proteineTotal} />
                  <p style={{ color: "black", fontSize: "16px" }}>Protéine</p>
                </span>
                <span style={{ display: "flex", justifyContent: "center" }}>
                  <Progress percent={carbTotal} />
                  <p style={{ color: "black", fontSize: "16px" }}>Carbs</p>
                </span>
              </Row>
            </div>
          </div>
          <Divider style={{ backgroundColor: "black" }} className="m-3" />

          <Row style={{ position: "absolute" }} className="mt-5 mb-5 col-md-12">
            <Row className="col-md-12">
              <Col className="col-md-10">
                <div class="fullWidth flex-left flex-column">
                  <h3 className="h-black"> Meal Plan </h3>
                  <p style={{ color: "#797c80", fontSize: "14px" }}>
                    Here You can set your objectifs and track your progress
                    based on your daily nutrition goal .
                  </p>
                </div>
              </Col>
              <Col
                className="col-md-2 pt-2"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div className="add-food-btn" onClick={handleClickOpen}>
                  <img src={addFood} alt="add Food" />
                </div>
                <h6 className="h-black pt-3 pl-2"> Add Food</h6>
              </Col>
            </Row>
            {dailyNutrition.map((food) => (
              <FoodList
                id={food.id}
                calorie={food.calorie}
                carb={food.carb}
                proteine={food.proteine}
                foodName={food.foodName}
                foodWeight={food.foodWeight}
              />
            ))}
          </Row>
        </Col>
      </Row>
      <div>
        <Dialog
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle
            id="responsive-dialog-title"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <p className="h-black "> {"Add Food"} </p>
          </DialogTitle>
          <Divider />
          <DialogContent className="text-center justify-content-center">
            <DialogContentText>
              You can choose between adding food by typing name or uploading
              your food image
            </DialogContentText>
            <Form.Label htmlFor="inlineFormInputGroupUsername2" srOnly>
              weight
            </Form.Label>
            <InputGroup
              className="mb-2 col-md-6 text-center"
              style={{ left: "25%" }}
            >
              <FormControl
                id="inlineFormInputGroupUsername2"
                placeholder="your food weight .."
                value={weightG}
                onChange={(e) => {
                  setWeightG(e.target.value);
                }}
              />
              <InputGroup.Prepend>
                <InputGroup.Text style={{ marginLeft: "0" }}>g</InputGroup.Text>
              </InputGroup.Prepend>
            </InputGroup>
            <div>
              <Row>
                <Form
                  inline
                  className="text-center justify-content-center mt-2"
                >
                  <Form.Control
                    placeHolder="search ..."
                    type="text"
                    name="q"
                    value={result}
                    onChange={(e) => {
                      setResult(e.target.value);
                    }}
                    // onChange={(e) => }
                    className="mr-sm-2 ml-sm-5"
                  ></Form.Control>

                  <i class="fas fa-search ml-1"></i>
                </Form>
              </Row>
              <p className="h-black mt-4 ml-2">Or</p>
            </div>
            <Row className="text-center">
              <div className="col-sm-7 text-center" style={{ left: "25%" }}>
                <div
                  className="image-dropbox"
                  onChange={() => {
                    setDisplay(false);
                    console.log("display : ", display);
                  }}
                >
                  {display && (
                    <div
                      className="placeholder"
                      {...getRootProps()}
                      style={{ display: { display } ? "block" : "none" }}
                    >
                      <img src={upload} />
                      <input {...getInputProps()} />
                      {isDragAActive ? (
                        <p>Drop the Image here ...</p>
                      ) : (
                        <p className="h-black">Tap here to add your food </p>
                      )}
                    </div>
                  )}
                  <h3>{result}</h3>
                  <div className="previews" onChange={hideDropBox}>
                    {Image.map((upFile) => {
                      //   blobToBase64(Image[0]).then((res) => {
                      //     sendData(res);
                      //   });
                      return (
                        <img
                          key={Math.floor(Math.random() * 10)}
                          src={upFile.preview}
                          style={{
                            width: "639.5px",
                            height: "353px",
                            border: "3px solid #ccc",
                          }}
                          alt="preview"
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="upload-section ">
                  <a className="fileUpload button" {...getRootProps()}>
                    <input {...getInputProps()} />
                    {isDragAActive ? (
                      <p>Drop the Image here ...</p>
                    ) : (
                      <p style={{ color: "white", marginBottom: "0" }}>
                        Upload{" "}
                      </p>
                    )}
                  </a>
                </div>
                <div className="url-section">URL Section</div>
              </div>
            </Row>
          </DialogContent>
          <DialogActions style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSave}
              startIcon={<SaveIcon />}
            >
              Save
            </Button>
            <RButton variant="primary" onClick={onUploadButton}>
              {send && (
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              {"    "}
              {send ? (
                "...Loading"
              ) : (
                <div>
                  <SaveIcon />
                  Send
                </div>
              )}
            </RButton>
          </DialogActions>
        </Dialog>
        {console.log("openWeight : ", openWeight)}
        <WeightDialog
          setOpenWeight={(op) => setOpenWeight(op)}
          openedWeight={openWeight}
        />
        {console.log("openWeight : ", openWeight)}
        <NutritionsDialog
          setOpenNutritions={(op) => setOpenNutritions(op)}
          openedNutritions={openNutritions}
        />
      </div>
    </div>
  );
}

export default ObjectifScreen;

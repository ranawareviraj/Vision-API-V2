const express = require("express");
const axios = require("axios").default;
const multer = require("multer");
const fs = require("fs");
const checkFileType = require("./filefilter");
const router = express.Router();
const config = require("./config")();
const path = require("path");
/**
 * File Upload middleware
 */
axios.defaults.baseURL = config.API_URL;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  limits: {
    fieldNameSize: 300,
    fileSize: 5242880, // 5 Mb
  },
});
const upload = multer({ storage: storage });

router.post(
  "/api/v1/images/annotate",
  upload.single("image"),
  async (req, res) => {
    let file = req.file;
    if (!req.file) {
      res.status(400).send({
        responses: [
          {
            error: {
              value: "400",
              msg: "Image missing in the request!!!",
            },
          },
        ],
      });
      return;
    }
    if (
      !(
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) ||
      ![".png", ".jpg", ".jpeg"].includes(
        path.extname(file.filename).toLocaleLowerCase()
      )
    ) {
      res.status(400).send({
        responses: [
          {
            error: {
              value: "400",
              msg: "Only .png, .jpg and .jpeg format allowed!'",
            },
          },
        ],
      });
      return;
    }

    const base64 = fs.readFileSync(req.file.path, "base64");
    if (req.headers.authorization === undefined) {
      res.status(401).send({
        responses: [
          {
            error: {
              value: "401",
              msg: "Please provide Basic Authorization using client id and secret given",
            },
          },
        ],
      });
    } else {
      let encoded = req.headers.authorization.split(" ")[1];
      let decoded = Buffer.from(encoded, "base64").toString("ascii");
      let client_id = decoded.split(":")[0];
      let client_secret = decoded.split(":")[1];
      if (
        client_id == config.USER_CREDENTIALS.client_id &&
        client_secret === config.USER_CREDENTIALS.client_secret
      ) {
        let { features } = req.body;
        if (!Array.isArray(features)) {
          if (features) {
            features = [features];
          } else {
            features = [];
          }
        }
        features = features.map((data) => {
          let feature = {
            type: data,
          };
          return feature;
        });
        if (features.length > 0) {
          axios
            .post(`/images:annotate?key=${config.API_KEY}`, {
              requests: [
                {
                  features: features,
                  image: {
                    content: base64,
                  },
                },
              ],
            })
            .then((response) => {
              res.json(response.data);
            })
            .catch((error) => {
              res.send(error);
            });
        } else {
          res.status(400).send({
            responses: [
              {
                error: {
                  value: "400",
                  msg: "features data missing.",
                },
              },
            ],
          });
        }
      } else {
        res.status(401).send({
          responses: [
            {
              error: {
                value: "401",
                msg: "Authentication Failed, Please provide basic token using credentials",
              },
            },
          ],
        });
      }
    }
  }
);
module.exports = router;

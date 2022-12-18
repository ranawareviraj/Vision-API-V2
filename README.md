# Vision API
## Author: Viraj Ranaware

## Purpose:
This API specification is general purpose guide offering thorough understanding of an Vision API's behavior. It describes how the API works and what outcomes are possible when using the API. 

This is general pupose guide. The Architects, Developers and QA Engineers should read the schema thoroughly before using the vision API, to avoid integration issues. Please refer technical specification of API here: [Vision API Technical Specification](http://198.199.121.111:3002/vision-api-docs/). The technical spefication provides detailed schema of the API request and response containing each attribute, its description and sample values.

## The API functionalities.

The Vision API derives insights from images. It can detect objects in an image, indentify image properties, its labels and which can be used for building valuable image metadata. It offers below functionalities:

### 1. Face Detection:
 The Vision API can detect multiple faces within an image along with the associated key facial attributes. The facial attribute includes :
  - A face-specific landmark e.g LEFT_EYE
  - Emotional states such as Joy Likelihood, Sorrow likelihood, Anger Likelihood with values such as LIKELY, UNLIKELY, POSSIBLE etc. 
  
  <sub>_Please refer [ API spcification](http://198.199.121.111:3002/vision-api-docs/) for all possible attributes and values returned._</sub>

<img width="740" alt="image" src="https://user-images.githubusercontent.com/112779376/207428045-920c2c62-a1ac-424e-aebd-229004d8046a.png">

For the above image API returns below result:

| State           | Value         |
| -------------   | ------------- |
|joyLikelihood	   | VERY_LIKELY   |
|sorrowLikelihood | VERY_UNLIKELY |
|angerLikelihood	 | VERY_UNLIKELY |

### 2. Image Properties:
 The Image Properties feature detects general attributes of the image, such as dominant color.
 
 <img width="740" alt="image" src="https://user-images.githubusercontent.com/112779376/207421399-b09f1768-c61b-4faa-94e9-e997327b297f.png">

For example, in above image below two colors are dominant:

<img width="948" alt="image" src="https://user-images.githubusercontent.com/112779376/207471548-3931f458-fae0-4fa4-ac22-ac33fe12038c.png">

<img width="948" alt="image" src="https://user-images.githubusercontent.com/112779376/207471480-72e22b84-9f84-4695-a116-a6f89b3cd547.png">

_RGB(Red-Blue-Green) to color can be converted [here](https://www.w3schools.com/colors/colors_rgb.asp)_
 
### 3. Detect labels:
The Vision API can detect and extract information about entities in an image, across a broad group of categories. Labels can identify general objects, locations, activities, animal species, products, and more. 

<sub>_Note: Labels are returned in English only._</sub>

<img width="740" alt="image" src="https://user-images.githubusercontent.com/112779376/207427861-cbac1557-3ab4-442b-a1b2-52be6fc37293.png">

For example, the above image API may return these list of labels:

| Description | Score |
| ----------- | ----- |
|Street	      | 0.872 |
|Snapshot	    | 0.852 |
|Town	        | 0.848 |
|Night	       | 0.804 |
|Alley	       | 0.713 |

 
 ## Working of the Vision API
 The Vision API is wrapper API over Vision API provided by Google cloud and aims to simplif access to image processing capabilities ofered by Google Cloud. The API takes the image from user as input and validates the request before passing to the backend API. API throws error if request does not have required information in correct format. API sends valid request to Google cloud vision API and pass the response to this API's consumer.
 
<img width="753" alt="image" src="https://user-images.githubusercontent.com/112779376/207647788-41a33b15-f7ff-420c-b243-478ae79f0d6e.png">

 
## Vision API Details
The API is available at http://198.199.121.111:3002/api/images/v1
 
### Endpoint: **`POST /annotate`**

**Parameters**

| Name        | Type    | In    | Required | Description                                                                                                                                          |
| ----------- | ------- | ----- | -------- | --------------------------------------------------------------------- |
| `features`  | string array  | form-data | yes       | Image features requested. Any of the (FACE_DETECTION, IMAGE_PROPERTIES, LABEL_DETECTION) value/s can be passed |
| `image`   | image | form-data  | yes       | Pass the image file. Allowed extentions are '.jpeg', '.jpg' or '.png'|

## API Authentication
The API require a basic authentication token sent in the `Authorization` header. Basic API token can be generated using client_id, client_secret provided.

Example:

`Authorization: Basic YOUR_TOKEN`

 
 Alternatively, In postman basic token can be added in Authorization as below:

<img width="1013" alt="image" src="https://user-images.githubusercontent.com/112779376/207436396-9debd2af-3823-4533-95b8-e000bb9fb80f.png">


**Sample Request:**

<img width="1013" alt="image" src="https://user-images.githubusercontent.com/112779376/207432981-87806e91-c091-418b-bced-e8d5deecae8c.png">

**Status codes**
| Status code      | Description |
|----------------- |-----------------------------------------------------|
| 200 OK           | Indicates a successful response with features detected in given image. |
| 400 Bad Request  | Indicates that mandatory data is missing in the request or sent in invalid format  |
| 401 Unauthorized | Indicates that either Authorization header is missing or invalid token is sent|

**Sample Response:**
```
{
  "responses": [
    {
      "faceAnnotations": [
        {
          "landmarks": [
            {
              "type": "LEFT_EYE",
              "position": {
                "x": 222.62032,
                "y": 135.68814,
                "z": 0.00029593706
              }
            }
          ],
          "rollAngle": -6.630813,
          "panAngle": -0.32251492,
          "tiltAngle": -5.054377,
          "detectionConfidence": 0.59218097,
          "landmarkingConfidence": 0.7632481,
          "joyLikelihood": "VERY_LIKELY",
          "sorrowLikelihood": "VERY_UNLIKELY",
          "angerLikelihood": "VERY_UNLIKELY",
          "surpriseLikelihood": "VERY_UNLIKELY",
          "underExposedLikelihood": "VERY_UNLIKELY",
          "blurredLikelihood": "VERY_UNLIKELY",
          "headwearLikelihood": "VERY_UNLIKELY"
        }
      ],
      "imagePropertiesAnnotation": {
        "dominantColors": {
          "colors": [
            {
              "color": {
                "red": 218,
                "green": 193,
                "blue": 168
              },
              "score": 0.0743989,
              "pixelFraction": 0.03259804
            }
          ]
        }
      }
    }
  ]
}
```

## Start using the API:
To see how API works, by sending requests to it. 

You can create your own request by following the API [specification](http://198.199.121.111:3002/vision-api-docs/) or you can simply import below collection into postman and send request to API.

Steps to send request to API:
 1. Download [vision-api-postman-collection](https://github.com/ranawareviraj/itis-6177-vision-api/blob/e7e761f95bddbc62b1ed7aca3e4247ea9e563745/vision-api-postman-collection.json) .
 3. In postman select import the downloaded collection. If you're unfamiliar with importing collections into the postman, follow [this guide](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman)
 4. Open the vision-api request. Add Basic Authentication, refer API Authentication section.
 5. Navigate to Body -> form-data
 
 <img width="1013" alt="image" src="https://user-images.githubusercontent.com/112779376/207475555-c3d11576-acf5-40f5-8412-60fdab6efb1e.png">
 
 5. Select one or more features (Available options are: IMAGE_PROPERTIES, FACE_DETECTION, LABEL_DETECTION)
 6. For image field, select type as File:

<img width="1013" alt="Screenshot 2022-12-13 at 7 38 11 PM" src="https://user-images.githubusercontent.com/112779376/207475938-11ef11be-92df-4a11-87de-83679439f02c.png">

7. Click on Select Files and browse image file from your computer.

<img width="1013" alt="Screenshot 2022-12-13 at 8 33 22 PM" src="https://user-images.githubusercontent.com/112779376/207483370-081c3f61-5505-46e5-8c2f-e1fcbe2accab.png">

9. Hit the Send button to send request to API. For valid requests, API returns requested information about the image.

<img width="1013" alt="image" src="https://user-images.githubusercontent.com/112779376/207477141-9ab2a6f9-c799-4ccf-9914-aa88dffa6b34.png">

 

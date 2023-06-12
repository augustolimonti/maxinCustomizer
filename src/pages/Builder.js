import Logo from '../img/Logo-contorno-hombre.png';
import React, { useCallback, useState, useEffect } from 'react';
import mergeImages from 'merge-images';
import axios from 'axios';
import { useRef } from 'react';
import { saveAs } from 'file-saver';

const Builder = () => {

  const [backgroundImage, setBackgroundImage] = useState();
  const [maxinImage, setMaxinImage] = useState();
  const [allLayerImages, setAllLayerImages] = useState({});
  const [imageArray, setImageArray] = useState([]);
  const [downloadImage, setDownloadImage] = useState([]);
  const [popupState, setPopupState] = useState("creatingImage")
  const [popup, setPopup] = useState(false)

  useEffect(() => {
    async function fetchData() {
      let tempImageArray = []
      const response = await axios.get('https://maxinbodyshop.s3.us-east-2.amazonaws.com/maxinCustomizer.json');
      setAllLayerImages(response.data);
      tempImageArray.push("https://maxinbodyshop.s3.us-east-2.amazonaws.com/customizer/polypurple.png")
      tempImageArray.push("https://maxinbodyshop.s3.us-east-2.amazonaws.com/customizer/maxinBack.png")
      tempImageArray.push(response.data['Skin'][Math.floor(Math.random() * response.data['Skin'].length)])
      tempImageArray.push(response.data['Clothing'][Math.floor(Math.random() * response.data['Clothing'].length)])
      tempImageArray.push(response.data['Held_Item'][Math.floor(Math.random() * response.data['Held_Item'].length)])
      tempImageArray.push(response.data['Head'][Math.floor(Math.random() * response.data['Head'].length)])
      tempImageArray.push(response.data['Eyes'][Math.floor(Math.random() * response.data['Eyes'].length)])
      tempImageArray.push(response.data['Ear'][Math.floor(Math.random() * response.data['Ear'].length)])
      tempImageArray.push(response.data['Face_Accessory'][Math.floor(Math.random() * response.data['Face_Accessory'].length)])
      tempImageArray.push(response.data['Mouth'][Math.floor(Math.random() * response.data['Mouth'].length)])
      setImageArray(tempImageArray)
    }

    fetchData();
  }, []);

  const randomHash = (length) => {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";
    for (let i = 0; i < length; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
  };

  const randomize = async () => {
    let tempImageArray = []
    tempImageArray.push("https://maxinbodyshop.s3.us-east-2.amazonaws.com/customizer/polypurple.png")
    tempImageArray.push("https://maxinbodyshop.s3.us-east-2.amazonaws.com/customizer/maxinBack.png")
    tempImageArray.push(allLayerImages['Skin'][Math.floor(Math.random() * allLayerImages['Skin'].length)])
    tempImageArray.push(allLayerImages['Clothing'][Math.floor(Math.random() * allLayerImages['Clothing'].length)])
    tempImageArray.push(allLayerImages['Held_Item'][Math.floor(Math.random() * allLayerImages['Held_Item'].length)])
    tempImageArray.push(allLayerImages['Head'][Math.floor(Math.random() * allLayerImages['Head'].length)])
    tempImageArray.push(allLayerImages['Ear'][Math.floor(Math.random() * allLayerImages['Ear'].length)])
    tempImageArray.push(allLayerImages['Eyes'][Math.floor(Math.random() * allLayerImages['Eyes'].length)])
    tempImageArray.push(allLayerImages['Face_Accessory'][Math.floor(Math.random() * allLayerImages['Face_Accessory'].length)])
    tempImageArray.push(allLayerImages['Mouth'][Math.floor(Math.random() * allLayerImages['Mouth'].length)])
    setImageArray(tempImageArray)

  }

  const handleDownloadAndTweet = async () => {
      setPopupState("creatingImage")
      setPopup(true)
      let identifyingHash = randomHash(50);
      var data = JSON.stringify({
        action: "createImage",
        imageArray: imageArray,
        identifyingHash: identifyingHash
      });
      var config = { //not available in sample code.
      };

      axios(config)
        .then(async (response) => {
          let blob = await fetch(response.data.imageLink).then((r) => r.blob());
          await saveAs(blob, 'maxin.png');

          console.log('got here')

          const tweetText = "Just used the @maxinNFT builder and it was dope - I'm officially a maxie! \n\nCheck it out:";
          const imageUrl = "https://maxinout.com/";
          const mediaId = "1646561367388717064";

          const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(imageUrl)}&media_ids=${encodeURIComponent(mediaId)}`;
          window.open(tweetUrl, "_blank");

          setPopup(false)
          setPopupState()

        })
        .catch(function (error) {
          // // console.log(error);
        });
}

  const renderPopup = () => {
    if (popupState === "creatingImage"){
      return (
        <div style={{position:'absolute', bottom: 35, right: 35, zIndex:100}}>
          <div className="bg-white rounded-md p-4 flex items-center">
            <img
              className="h-5 w-5 mr-4 animate-spin"
              src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/0.16.1/images/loader-large.gif"
              alt="Loading"
            />
            <p className="text-gray-800 font-gilroy-bold">Image is being created...</p>
          </div>
        </div>
      )
    }
    // else if (popupState === "twitterURLfailed"){
    //   <div style={{position:'absolute', bottom: 35, right: 35, zIndex:100}}>
    //     <div className="bg-white rounded-md p-4 flex items-center">
    //       <img
    //         className="h-5 w-5 mr-4 animate-spin"
    //         src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/0.16.1/images/loader-large.gif"
    //         alt="Loading"
    //       />
    //       <p className="text-gray-800 font-gilroy-bold">We are unable to open up </p>
    //     </div>
    //   </div>
    // }
  }

  return (
    <div class="flex flex-cols">
      {popup ? renderPopup() : ""}
      <div class="flex flex-row justify-between z-10">
          <img src={Logo} className="h-24 w-24 md:h-32 md:w-32 ml-8 mt-4" alt="Logo" />
          <div>
              <img className="h-16 w-16 md:h-24 md:w-24 mr-8 mt-8 hover:opacity-50" src={require('../img/twitter-icon.png')} onClick = {handleDownloadAndTweet} style={{position:'absolute', top: 0, right: 0, zIndex:100}} alt="Logo"/>
              <img className="h-[100px] w-[100px] mr-24 mt-16 md:mr-32 md:mt-28 lg:mr-36 lg:mt-24" src={require('../img/arrow-one.png')} style={{position:'absolute', top: 0, right: 0, zIndex:100}} alt="Logo"/>
              <p className="font-gilroy-bold text-2xl text-right h-[100px] w-[300px] lg:w-[400px] mr-12 mt-36 md:mr-16 md:mt-48" style={{position:'absolute', top: 0, right: 0, zIndex:100}}>post your creation on twitter for a chance to win a free NFT!</p>
          </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-end" style={{backgroundImage: `url(${imageArray[0]})`, backgroundSize: 'cover'}}>
              {imageArray.slice(2).map((image, index) => (
                <img
                  key={index}
                  className={`absolute bottom-0 max-w-full max-h-full z-${index + 1}`}
                  src={image}
                  onClick={()=>randomize()}
                />
              ))}
        </div>
      </div>
      <div>
        <img className="mb-[320px] ml-8 md:mb-96 xl:mb-28 xl:ml-36 h-36 w-36 md:h-48 md:w-48 transform rotate-45 md:rotate-0" src={require('../img/arrow-two.png')} style={{position:'absolute', bottom: 0, left: 0, zIndex:100}} alt="Logo"/>
        <p className="font-gilroy-bold text-center uppercase text-lg mb-[330px] ml-4 w-[100px] md:text-2xl md:mb-80 xl:mb-12 xl:ml-28 md:w-[200px] md:h-[100px]" style={{position:'absolute', bottom: 0, left: 0, zIndex:100}}>click to randomize</p>
      </div>

    </div>
  )

}

export default Builder

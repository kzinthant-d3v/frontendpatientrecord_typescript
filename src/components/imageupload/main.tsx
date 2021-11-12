/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactElement } from 'react';
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { ReactComponent as Add } from './assets/add.svg';
import { ReactComponent as Left } from './assets/left.svg';
import { ReactComponent as Right } from './assets/right.svg';
import './styles/index.css';
import colors from '../global/themes/colors';
import { ThemeContext } from '../global/context/ThemeProvider';

function Image():ReactElement {
  const { theme } = React.useContext(ThemeContext);
  const [images, setImages] = React.useState<ImageListType>([]);
  const [gallery, setGallery] = React.useState(false);
  const [currentGallery, setCurrentGallery] = React.useState(0);

  const onChange = (
    imageList: ImageListType,
    // addUpdateIndex: number[] | undefined,
  ):void => {
    // data for submit
    setImages(imageList);
  };
  return (
    <div>
      {
        gallery && images.length > 0
        && (
        <div
          id="gallery"
          aria-hidden="true"
          onClick={() => setGallery(false)}
        >
          <div
            id="left"
            aria-hidden="true"
            onClick={
              (e) => {
                e.stopPropagation();
                if (currentGallery !== 0) {
                  setCurrentGallery(currentGallery - 1);
                }
              }
            }
          >
            <Left />
          </div>
          <div className="galleryArea">
            <div className="removeGallery">
              X
            </div>
            <img
              aria-hidden="true"
              onClick={(e) => e.stopPropagation()}
              className="one_gallery_image"
              src={images[currentGallery].dataURL}
              alt="teeth"
            />
          </div>
          <div
            id="right"
            aria-hidden="true"
            onClick={
              (e) => {
                e.stopPropagation();
                if (currentGallery < images.length - 1) {
                  setCurrentGallery(currentGallery + 1);
                }
              }
            }
          >
            <Right />
          </div>
        </div>
        )
      }
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={10}
      >
        {
          ({
            imageList,
            onImageUpload,
            onImageRemove,
            dragProps,
            isDragging,
          }) => (
            <div id="images_list_area">
              <div id="images">
                {
                  imageList.map((img, index) => (
                    <div
                      aria-hidden="true"
                      onClick={() => {
                        setCurrentGallery(index);
                        setGallery((prev) => !prev);
                      }}
                      className="unique_image"
                      key={Math.random()}
                    >
                      <div
                        aria-hidden="true"
                        onClick={(e) => { e.stopPropagation(); onImageRemove(index); }}
                        className="removeImage"
                      >
                        X
                      </div>
                      <img className="one_image" src={img.dataURL} alt="teeth" />
                    </div>
                  ))
                }
                <div
                  {...dragProps}
                  aria-hidden="true"
                  onClick={onImageUpload}
                  id="image_area"
                  style={{
                    backgroundColor: isDragging ? '#76DC9F45'
                      : colors.inputback[theme],
                  }}
                >
                  <Add />
                </div>
              </div>
            </div>
          )
        }
      </ImageUploading>
    </div>
  );
}

export default Image;
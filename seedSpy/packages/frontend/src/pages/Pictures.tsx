import Footer from "../components/header/footer";
import Header from "../components/header/header";
import PictureA from "../assets/picture_1.webp";
import PictureB from "../assets/cats_2.webp";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { Api } from "../App";

interface Picture {
  name: string;
  src: string;
}

const Pictures = (): JSX.Element => {
  const [pictures, setPictures] = useState<Picture[]>([]);

  useEffect(() => {
    const setBasePictures = async () => {
      const pictures = await getPictures();
      const permanentPictures = getPermanentPictures();
      const allPictures = pictures ? [...pictures, ...permanentPictures] : permanentPictures;
      setPictures(allPictures);
    };
    setBasePictures();
  }, []);

  const getPermanentPictures = () => {
    return [
      {
        name: "Cool picture",
        src: PictureA,
      },
      {
        name: "picture with cats",
        src: PictureB,
      },
    ];
  };

  const getPictures = async (): Promise<Picture[] | null> => {
    try {
      const res: AxiosResponse<{ status: boolean, pictures: Picture[] }> = await axios.get(
        `${Api.url}/api/users/pictures`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('seedSpyToken')}`,
          }
        }
      );

      if (res.status === 200 && res.data.status) {
        const pictures: Picture[] = [];
        res.data.pictures.forEach((picture: Picture) => {
          pictures.push({
            name: picture.name,
            src: `${Api.url}/api/${picture.src}`,
          });
        });
        return pictures;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_e) {
      console.log('Error during fetching pictures');
    }
    return null;
  };

  return (
    <div id="picturesPage" className="header-bg">
      <Header />
      <section id="Pictures" className="h-[94vh] flex flex-col items-center max-w-[85vw] m-auto">
        <h1 className="text-white mt-4 text-5xl font-semibold text-center">
          Pictures
        </h1>
        <Carousel className="bg-white p-8 mt-4 w-[34vw] rounded-lg shadow-lg flex justify-center items-center">
          <CarouselContent className="w-[28vw]">
            {
              pictures.map((picture, index) => (
                <CarouselItem className="basis-full flex flex-col justify-center items-center max-w-[28vw]" key={index}>
                  <span className="text-center text-emerald-700 font-bold">
                    {picture.name}
                  </span>
                  <img src={picture.src} className="w-full mt-1 bg-cover rounded-sm overflow-x-hidden" alt={`Picture ${picture.name} ${index}`} />
                </CarouselItem>
              ))
            }
          </CarouselContent>
          <CarouselPrevious className="ms-14 bg-emerald-700 text-white w-10" />
          <CarouselNext className="me-14 bg-emerald-700 text-white w-10" />
        </Carousel>
      </section>
      <Footer />
    </div>
  );
};

export default Pictures;
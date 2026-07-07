import { Bird, Cat, Leaf } from "lucide-react";
import Footer from "../components/header/footer";
import Header from "../components/header/header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Link } from "react-router-dom";
import picture2 from "../assets/picture_2.webp";
import catsAndHorse from "../assets/cats_horses.webp";
import birds from "../assets/picture_3.webp";

const Home = (): JSX.Element => {
  return (
    <div id="homePage">
      <div id="homePageBackground" className="header-bg">
        <Header />
        <section id="Home" className="w-[85vw] min-h-[90vh] m-auto flex flex-col justify-between">
          <div>
            <div id="homeFirstBlock" className="max-w-6xl mx-auto mt-4 overflow-hidden">
              <div className="pt-2 text-center">
                <div className="uppercase tracking-wide text-sm text-emerald-400 font-semibold">
                  Welcome to SeedSpy
                </div>
                <h1 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                  Nature, cats and other cool things
                </h1>
                <p className="mt-4 text-xl text-white font-bold">
                  The site is in its first version, we hope you like it
                </p>
              </div>
            </div>

            <div className="mt-12 grid gap-8 xl:grid-cols-3">
              <Card className="flex flex-row">
                <div>
                  <CardHeader>
                    <Leaf className="w-8 h-8 text-green-500 mb-2" />
                    <CardTitle>Explore Nature</CardTitle>
                    <CardDescription>Discover pictures and articles inspired by the beauty of nature.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-justify">
                      We share many photos of nature, do not hesitate to send us some (png or jpg) by email to seespy@notadomain.com
                    </p>
                  </CardContent>
                </div>
                <div className="p-4 flex justify-center items-center">
                  <img src={picture2} alt="Nature" className="w-[28vw] rounded-md" />
                </div>
              </Card>

              <Card className="flex flex-row">
                <div>
                  <CardHeader>
                    <Cat className="w-8 h-8 text-orange-500 mb-2" />
                    <CardTitle>The spirit of the cat accompanies you</CardTitle>
                    <CardDescription>
                      We're going a bit too much with the cats, I agree, especially since there aren't that many on the site.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-justify">
                      Cats are great, like dogs, like any animal that exists, besides if you are reading this don't kill the spiders in your house they won't harm you I think (I hope)
                    </p>
                  </CardContent>
                </div>
                <div className="p-4 flex justify-center items-center">
                  <img src={catsAndHorse} alt="Nature" className="w-[28vw] rounded-md" />
                </div>
              </Card>

              <Card className="flex flex-row">
                <div>
                  <CardHeader>
                    <Bird className="w-8 h-8 text-blue-500 mb-2" />
                    <CardTitle>What is planned</CardTitle>
                    <CardDescription>Adding birds to the site</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-justify">
                      In the future we would also like to add a section for birds which are also friends of nature, except pigeons.<br></br>
                      If you would like to participate in this new section, send us an email so we can discuss your profile
                    </p>
                  </CardContent>
                </div>
                <div className="p-4 flex justify-center items-center">
                  <img src={birds} alt="Nature" className="w-[28vw] rounded-md" />
                </div>
              </Card>
            </div>
          </div>

          <div className="flex flex-row justify-center">
            <div className="mt-12 text-center p-6">
              <h2 className="text-2xl font-bold text-slate-900">Want to access the rest of the site?</h2>
              <p className="mt-4 text-lg text-slate-950">
                Register now and enjoy the avatar generator
              </p>
              <div className="mt-6">
                <Link to="/auth">
                  <Button variant="outline">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
import Footer from "../components/header/footer";
import Header from "../components/header/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import PictureA from "../assets/picture_1.webp";
import ChartDonut from "../charts/chartDonut";

const About = (): JSX.Element => {
  return (
    <div id="AboutPage">
      <div id="AboutPageContainer" className="header-bg">
        <Header />
        <section id="About" className="container mx-auto p-2">
          <Card className="mt-2">
            <CardHeader>
              <CardTitle className="text-3xl">
                About us and +
              </CardTitle>
              <CardDescription>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus elementum porta metus at mattis. Vivamus tristique ultricies maximus. Ut et facilisis nulla.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-row justify-between">
                <div className="w-[38vw]">
                  <div className="text-justify text-md space-y-4">
                    <p>
                      Suspendisse porta convallis enim ut tincidunt. Mauris urna libero, facilisis eu arcu a, vulputate suscipit justo. Sed nunc est, aliquam in porta a, vulputate quis velit. Phasellus lobortis nunc libero, eget commodo odio maximus quis. Nam elementum mi risus, eu facilisis neque ultrices a. Donec sapien metus, aliquet in pretium in, semper at risus. Vestibulum tincidunt metus at urna scelerisque, eget vestibulum nisl congue. Maecenas et nunc eget mi pharetra fringilla.
                    </p>
                    <p>
                      Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Etiam ante erat, imperdiet sed risus non, venenatis blandit turpis. Fusce porta diam sed justo ornare, eget rhoncus metus placerat.
                    </p>
                  </div>
                  <div className="mt-4">
                    <ChartDonut />
                  </div>
                </div>
                <div>
                  <img className="w-[34vw] rounded-xl" src={PictureA} />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default About;
import { useEffect, useRef, useState } from 'react';
import Footer from '../components/header/footer';
import Header from '../components/header/header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { MoveRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import SaveAvatar from '../avatar/saveAvatar';
import { toast } from '../hooks/use-toast';

export interface AvatarPart {
  [key: string]: string | null;
}

const Avatar = (): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [avatarParts, setAvatarParts] = useState<any>({});
  const [currentParts, setCurrentParts] = useState<AvatarPart>({
    head: null,
    eyes: null,
    noise: null,
    mouth: null,
    ears: null
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [avatarSaved, setAvatarSaved] = useState(false);
  const [savedAvatarName, setSavedAvatarName] = useState('');

  const options: string[] = [
    'Head', 'Eyes', 'Noise', 'Mouth', 'Ears'
  ];

  const resetAvatar = () => {
    setCurrentParts({
      head: null,
      eyes: null,
      noise: null,
      mouth: null,
      ears: null
    });
  }

  const getAvatarParts = () => {
    const avatarPath = document.URL.includes(':5173') ? '/public/assets/avatar' : '/assets/avatar';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parts: any = {
      head: [],
      eyes: [],
      noise: [],
      mouth: [],
      ears: []
    };

    for (const key in parts) {
      const partContent = [];
      for (let i = 1; i <= 4; i++) {
        const image = new Image();
        image.src = `${avatarPath}/${key}_${i}.png`;
        partContent.push({
          name: `${key}_${i}`,
          src: image.src,
        });
      }
      parts[key] = partContent;
    }

    return parts;
  }

  function selectAvatarItem(itemType: string, avatarItem: string) {
    const key = itemType.slice(0, itemType.indexOf('_'));
    const tmp = currentParts;
    tmp[key] = avatarItem;
    setCurrentParts(tmp);
    updateAvatar(tmp);
  }

  function updateAvatar(newParts: AvatarPart) {
    const avatarContainer = document.getElementById("avatarResult");
    if (avatarContainer !== null) {
      avatarContainer.innerHTML = "";
      for (const key in newParts) {
        const newImg = document.createElement("img");
        if (newParts[key] !== null) {
          newImg.id = key;
          newImg.src = newParts[key];
        }
        avatarContainer.appendChild(newImg);
      }
    }
  }

  useEffect(() => {
    const tmp = getAvatarParts();
    setAvatarParts(tmp);
    if (avatarSaved) {
      resetAvatar();
      toast({
        title: 'Avatar saved',
        description: `Avatar saved with name: ${savedAvatarName}`,
        variant: 'default',
      });
      setAvatarSaved(false);
    }
  }, [avatarSaved, savedAvatarName]);

  return (
    <div id="avatarPage" className="header-bg">
      <Header />
      <section id="Avatar" className="text-black min-h-[90vh]">
        <h1 className="text-white font-bold text-center mt-1 mb-1 text-4xl">Avatar Maker</h1>
        <div className="bg-white shadow-lg rounded-xl p-4 max-w-[60vw] m-auto">
          <div id="avatarCreationSection" className="flex h-full justify-between flex-row">
            <div className="border-1 border-gray-400 p-1 rounded-md border">
              <Tabs defaultValue="head">
                <TabsList className="w-full justify-between">
                  {
                    options.map((option) => (
                      <TabsTrigger className="w-full" key={option} value={option.toLowerCase()}>
                        {option}
                      </TabsTrigger>
                    ))
                  }
                </TabsList>
                {
                  Object.keys(avatarParts).length > 0 &&
                  options.map((option) => (
                    <TabsContent className="flex flex-wrap flex-row max-w-96" value={option.toLowerCase()}>
                      {
                        avatarParts[option.toLowerCase()]?.map((part: { name: string; src: string }) => (
                          <div draggable={false} className="w-1/2" key={part.name}>
                            <img draggable={false} onClick={() => selectAvatarItem(part.name, part.src)} 
                            className="avatar-img-item mt-2 hover:cursor-pointer" key={part.name} src={part.src} alt={part.name} />
                          </div>
                        ))
                      }
                    </TabsContent>
                  ))
                }
              </Tabs>
            </div>
            <div className="mt-auto mb-auto">
              <MoveRight size={32} />
            </div>
            <div className="border-1 border border-gray-400 p-1 w-[34vw] rounded-md">
              <p className="text-center text-xl" id="avatarTextAlt">Avatar will be here</p>
              <div id="avatarResult" className="w-full flex justify-center relative">
                
              </div>
              <canvas id="avatarCanvas" hidden={true} width="700" ref={canvasRef}>
              </canvas>
            </div>
          </div>
          <div className="flex flex-row justify-end space-x-2 mt-4">
            <Button onClick={resetAvatar} variant={'destructive'}>
              Reset avatar
            </Button>
            <SaveAvatar
              setAvatarSaved={(v: boolean) => setAvatarSaved(v)} 
              currentParts={currentParts} 
              setSavedAvatarName={(name: string) => setSavedAvatarName(name)}
            />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Avatar;
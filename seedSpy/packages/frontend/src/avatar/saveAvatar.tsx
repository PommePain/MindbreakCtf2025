import { useState } from "react";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosResponse } from "axios";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { AlertCircle } from "lucide-react";
import { AvatarPart } from "../pages/Avatar";
import { Api } from "../App";

const avatarSaveSchema = z.object({
  filename: z.string().min(6, {
    message: `Avatar filename must be at least 6 characters.`
  }).max(40),
});

interface SaveAvatarProps {
  currentParts: AvatarPart;
  setAvatarSaved: (value: boolean) => void;
  setSavedAvatarName: (value: string) => void;
}

export type AvatarSave = z.infer<typeof avatarSaveSchema>;

const SaveAvatar = (props: SaveAvatarProps) => {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  const form = useForm<AvatarSave>({
    resolver: zodResolver(avatarSaveSchema),
    mode: 'onSubmit',
    defaultValues: {
      filename: '',
    },
  });

  const getAvatarImage = async (): Promise<Blob | null> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const canvas: any = document.getElementById("avatarCanvas");
    if (canvas !== null) {
      const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
      canvas.height = 400;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const key in props.currentParts) {
        if (props.currentParts[key] !== null) {
          const image = new Image();
          image.src = props.currentParts[key];
          ctx.drawImage(image, 0, 0, 400, 400);
        } else {
          return null;
        }
      }

      const avatarImage = canvas.toDataURL("image/png");
      const avatarBlob = await fetch(avatarImage);
      const blob = await avatarBlob.blob();
      return blob;
    }
    return null;
  };

  const handleSubmit = async (values: AvatarSave) => {
    setIsSubmitting(true);
    const formData = new FormData();
    const image = await getAvatarImage();
    if (image !== null && image instanceof Blob) {
      formData.append('file', image);
      formData.append('filename', values.filename);

      try {
        const res: AxiosResponse<{ jwt: string, status: true }> = await axios.post(
          `${Api.url}/api/users/avatar/save`,
          formData,
          {
            withCredentials: false,
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${localStorage.getItem('seedSpyToken')}`
            }
          }
        );
        if (res.status === 200 && res.data.status) {
          form.reset();
          props.setAvatarSaved(true);
          setPopupOpen(false);
          props.setSavedAvatarName(values.filename);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setError('Data incorrect');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Dialog open={popupOpen} onOpenChange={setPopupOpen}>
      <DialogTrigger>
        <Button className="bg-green-700 hover:bg-green-800" variant={'default'}>
          Save Avatar
        </Button>
      </DialogTrigger>
      <DialogContent className="p-1">
        <DialogHeader className="pt-4 ps-5">
          <DialogTitle className="text-xl">Save Avatar</DialogTitle>
          <DialogDescription>Save your avatar to Pictures Page (Only last 5 avatars are displayed)</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <Card className=" pt-0 justify-center bg-none border-none shadow-none flex flex-col items-between mt-1">
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <FormField
                  control={form.control}
                  name="filename"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="MySuperAvatar" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between pb-2">
                <Button variant="destructive">
                  Cancel
                </Button>
                {isSubmitting ? (
                  <Button type="submit" variant="default" disabled>
                    Loading...
                  </Button>
                ) : (
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-800" variant="default">
                    Save and download
                  </Button>
                )}
              </CardFooter>
            </Card>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default SaveAvatar;
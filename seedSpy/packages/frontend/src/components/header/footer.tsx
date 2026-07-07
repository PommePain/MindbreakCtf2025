import { FunctionComponent } from 'react';

const Footer: FunctionComponent = () => {
  return (
    <footer className='bg-slate-800 bottom-0'>
      <div className='max-w-[90vw] text-white m-auto p-4'>
        <h1 className='text-xl font-bold'>SeedSpy</h1>
        <p>
          Images are generated and provided by DALL-E (Artificial Intelligence), cat avatars are property of SeedSpy and are original images created
        </p>
        <p className='text-center'>Seed Spy &copy;  </p>
      </div>
    </footer>
  );
};

export default Footer;
